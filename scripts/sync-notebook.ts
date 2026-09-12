import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

interface DirectoryPayload {
  name: string;
  slug: string;
  path: string;
  parentPath: string | null;
  description: string;
  icon: string;
}

interface SyncNotePayload {
  title: string;
  slug: string;
  summary: string;
  content: string;
  sourcePath: string;
  directoryPath: string | null;
  tags: string[];
}

interface Frontmatter {
  title?: string;
  summary?: string;
  tags: string[];
  draft: boolean;
  private: boolean;
}

interface SyncResponse {
  code: number;
  message: string;
  data: {
    created: number;
    updated: number;
  };
}

interface PayloadResult {
  directories: DirectoryPayload[];
  allNotes: NoteWithHash[];
  changedNotes: NoteWithHash[];
  skipped: number;
  filledEmptyNotes: number;
  imageStats: ImageStats;
  warnings: string[];
}

interface NoteWithHash {
  payload: SyncNotePayload;
  hash: string;
}

interface ImageStats {
  referenced: number;
  uploaded: number;
  reused: number;
  skippedOversized: number;
}

interface SyncOptions {
  uploadConcurrency: number;
  requestTimeoutMs: number;
  retryCount: number;
  maxImageSizeBytes: number;
  forceFull: boolean;
}

interface PreparedAsset {
  key: string;
  filePath: string;
  hash: string;
  size: number;
  mimeType: string;
  upload: boolean;
}

interface NoteCandidate {
  payload: Omit<SyncNotePayload, "content">;
  body: string;
  hash: string;
}

const SyncStateSchema = z.object({
  version: z.literal(1),
  notes: z.record(z.object({ hash: z.string().regex(/^[a-f0-9]{64}$/) })),
  assets: z.record(
    z.object({
      hash: z.string().regex(/^[a-f0-9]{64}$/),
      url: z.string().url(),
    }),
  ),
});

type SyncState = z.infer<typeof SyncStateSchema>;
const SyncResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({ created: z.number(), updated: z.number() }),
});

const AssetSyncResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({ url: z.string().url() }),
});

const DEFAULT_NOTEBOOK_DIR = "/run/media/li/Develop/notebook";
const DEFAULT_SYNC_URL = "http://mysgarden.top/api/v1/notes/sync";
const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_UPLOAD_CONCURRENCY = 4;
const DEFAULT_REQUEST_TIMEOUT_MS = 60_000;
const DEFAULT_RETRY_COUNT = 3;
const MAX_SERVER_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const DEFAULT_SYNC_STATE_FILE = ".cache/notebook-sync-state.json";

function loadLocalEnvironment(): void {
  const overrides = new Map([
    ["NOTE_SYNC_TOKEN", process.env.NOTE_SYNC_TOKEN],
    ["NOTE_SYNC_URL", process.env.NOTE_SYNC_URL],
    ["NOTEBOOK_DIR", process.env.NOTEBOOK_DIR],
    ["NOTE_SYNC_BATCH_SIZE", process.env.NOTE_SYNC_BATCH_SIZE],
    ["NOTE_SYNC_ASSET_URL", process.env.NOTE_SYNC_ASSET_URL],
    ["NOTE_SYNC_UPLOAD_CONCURRENCY", process.env.NOTE_SYNC_UPLOAD_CONCURRENCY],
    ["NOTE_SYNC_REQUEST_TIMEOUT_MS", process.env.NOTE_SYNC_REQUEST_TIMEOUT_MS],
    ["NOTE_SYNC_RETRY_COUNT", process.env.NOTE_SYNC_RETRY_COUNT],
    ["NOTE_SYNC_MAX_IMAGE_SIZE_MB", process.env.NOTE_SYNC_MAX_IMAGE_SIZE_MB],
    ["NOTE_SYNC_STATE_FILE", process.env.NOTE_SYNC_STATE_FILE],
    ["NOTE_SYNC_FORCE", process.env.NOTE_SYNC_FORCE],
  ]);
  if (fs.existsSync(".env") && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(".env");
  }
  for (const [name, value] of overrides) {
    if (value !== undefined) process.env[name] = value;
  }
}

function makeSlug(value: string, seed: string): string {
  const cleaned = value
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const hash = crypto.createHash("md5").update(seed).digest("hex").slice(0, 6);
  return `${cleaned.slice(0, 70) || "note"}-${hash}`;
}

function parseBoolean(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  const rawTags =
    trimmed.startsWith("[") && trimmed.endsWith("]")
      ? trimmed.slice(1, -1).split(",")
      : trimmed.split(",");

  return [
    ...new Set(
      rawTags
        .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean),
    ),
  ];
}

function parseFrontmatter(content: string): {
  frontmatter: Frontmatter;
  body: string;
} {
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const empty: Frontmatter = { tags: [], draft: false, private: false };
  if (lines[0] !== "---") return { frontmatter: empty, body: normalized };

  const closingIndex = lines.findIndex(
    (line, index) => index > 0 && line === "---",
  );
  if (closingIndex === -1) return { frontmatter: empty, body: normalized };

  const fields = new Map<string, string>();
  for (const line of lines.slice(1, closingIndex)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0) continue;
    fields.set(
      line.slice(0, separatorIndex).trim().toLowerCase(),
      line.slice(separatorIndex + 1).trim(),
    );
  }

  return {
    frontmatter: {
      title: fields.get("title"),
      summary: fields.get("summary"),
      tags: parseTags(fields.get("tags")),
      draft: parseBoolean(fields.get("draft")),
      private: parseBoolean(fields.get("private")),
    },
    body: lines
      .slice(closingIndex + 1)
      .join("\n")
      .replace(/^\n+/, ""),
  };
}

function extractMetadata(
  content: string,
  fallbackTitle: string,
  frontmatter: Frontmatter,
): Pick<SyncNotePayload, "title" | "summary"> {
  const lines = content.split("\n");
  let title = frontmatter.title?.trim() || fallbackTitle;
  let headingIndex = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() || "";
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      if (!frontmatter.title) title = line.replace(/^#\s+/, "").trim();
      headingIndex = index;
      break;
    }
  }

  let summary = frontmatter.summary?.trim() || "";
  if (!summary) {
    for (let index = 0; index < lines.length; index += 1) {
      if (index === headingIndex) continue;
      const line = lines[index]?.trim() || "";
      if (!line || line.startsWith("#") || line.startsWith(">")) continue;
      const plainText = line.replace(/[`*_~[\]()]/g, "").trim();
      if (plainText.length > 10) {
        summary = plainText.slice(0, 200);
        break;
      }
    }
  }

  return {
    title: title.slice(0, 200),
    summary: (summary || `${title} - 知识库速查备忘`).slice(0, 500),
  };
}

function isPrivatePath(relativePath: string): boolean {
  return relativePath
    .split(path.sep)
    .some((part) => part.startsWith("_") || part.startsWith("."));
}

function collectMarkdownFiles(
  directory: string,
  baseDirectory: string,
): Array<{ fullPath: string; relativePath: string }> {
  const files: Array<{ fullPath: string; relativePath: string }> = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath, baseDirectory));
      continue;
    }
    if (!entry.isFile() || !/\.(?:md|markdown)$/i.test(entry.name)) continue;
    files.push({
      fullPath,
      relativePath: path.relative(baseDirectory, fullPath),
    });
  }
  return files;
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function createDirectories(
  files: ReadonlyArray<{ relativePath: string }>,
): DirectoryPayload[] {
  const directories = new Map<string, DirectoryPayload>();
  for (const file of files) {
    const parts = toPosixPath(file.relativePath).split("/");
    parts.pop();
    for (let depth = 1; depth <= parts.length; depth += 1) {
      const directoryPath = parts.slice(0, depth).join("/");
      if (directories.has(directoryPath)) continue;
      const name = parts[depth - 1] || directoryPath;
      const parentPath = depth > 1 ? parts.slice(0, depth - 1).join("/") : null;
      directories.set(directoryPath, {
        name: name.slice(0, 50),
        slug: makeSlug(name, directoryPath).slice(0, 50),
        path: directoryPath,
        parentPath,
        description: `${directoryPath} 知识目录`.slice(0, 200),
        icon: depth === 1 ? "folder" : "folder-tree",
      });
    }
  }
  return [...directories.values()].sort((left, right) =>
    left.path.localeCompare(right.path, "zh-CN"),
  );
}

const IMAGE_MIME_TYPES: Readonly<Record<string, string>> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

function isRemoteReference(reference: string): boolean {
  return /^(?:https?:)?\/\//i.test(reference) || reference.startsWith("data:");
}

function resolveLocalImage(
  notebookDirectory: string,
  notePath: string,
  reference: string,
): string | null {
  if (isRemoteReference(reference)) return null;
  const cleanReference = reference.split(/[?#]/, 1)[0] || "";
  const decodedReference = (() => {
    try {
      return decodeURIComponent(cleanReference);
    } catch {
      return cleanReference;
    }
  })();
  const ext = path.extname(decodedReference).toLowerCase();
  if (!IMAGE_MIME_TYPES[ext]) return null;

  const root = path.resolve(notebookDirectory);
  const candidates = decodedReference.startsWith("/")
    ? [path.resolve(root, `.${decodedReference}`)]
    : [
        path.resolve(path.dirname(notePath), decodedReference),
        path.resolve(root, decodedReference),
      ];
  for (const candidate of candidates) {
    const relative = path.relative(root, candidate);
    if (
      !relative.startsWith("..") &&
      !path.isAbsolute(relative) &&
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile()
    ) {
      return candidate;
    }
  }
  return null;
}

function sha256(value: string | Buffer): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function getAssetKey(notebookDirectory: string, imagePath: string): string {
  return toPosixPath(path.relative(notebookDirectory, imagePath));
}

function extractImageReferences(content: string): string[] {
  const references = new Set<string>();
  for (const match of content.matchAll(
    /!\[([^\]]*)\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g,
  )) {
    const reference = match[2] || match[3];
    if (reference) references.add(reference);
  }
  for (const match of content.matchAll(
    /!\[\[([^\]|#]+)(?:#[^|\]]*)?(?:\|[^\]]*)?\]\]/g,
  )) {
    if (match[1]) references.add(match[1]);
  }
  return [...references];
}

function createEmptySyncState(): SyncState {
  return { version: 1, notes: {}, assets: {} };
}

function loadSyncState(statePath: string, warnings: string[]): SyncState {
  if (!fs.existsSync(statePath)) return createEmptySyncState();
  try {
    const parsed = SyncStateSchema.safeParse(
      JSON.parse(fs.readFileSync(statePath, "utf8")) as unknown,
    );
    if (parsed.success) return parsed.data;
    warnings.push(`忽略无效同步状态文件：${statePath}`);
  } catch {
    warnings.push(`无法读取同步状态文件：${statePath}`);
  }
  return createEmptySyncState();
}

function saveSyncState(statePath: string, state: SyncState): void {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  const temporaryPath = `${statePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, statePath);
}

function getPositiveInteger(
  value: string | undefined,
  fallback: number,
  maximum: number,
): number {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= maximum
    ? parsed
    : fallback;
}

function getSyncOptions(): SyncOptions {
  const maxSizeMb = getPositiveInteger(
    process.env.NOTE_SYNC_MAX_IMAGE_SIZE_MB,
    MAX_SERVER_IMAGE_SIZE_BYTES / (1024 * 1024),
    MAX_SERVER_IMAGE_SIZE_BYTES / (1024 * 1024),
  );
  return {
    uploadConcurrency: getPositiveInteger(
      process.env.NOTE_SYNC_UPLOAD_CONCURRENCY,
      DEFAULT_UPLOAD_CONCURRENCY,
      8,
    ),
    requestTimeoutMs: getPositiveInteger(
      process.env.NOTE_SYNC_REQUEST_TIMEOUT_MS,
      DEFAULT_REQUEST_TIMEOUT_MS,
      10 * 60_000,
    ),
    retryCount: getPositiveInteger(
      process.env.NOTE_SYNC_RETRY_COUNT,
      DEFAULT_RETRY_COUNT,
      10,
    ),
    maxImageSizeBytes: maxSizeMb * 1024 * 1024,
    forceFull:
      process.argv.includes("--full") || parseBoolean(process.env.NOTE_SYNC_FORCE),
  };
}

function createConcurrencyLimiter(maximum: number): <T>(task: () => Promise<T>) => Promise<T> {
  let active = 0;
  const waiting: Array<() => void> = [];
  const runNext = (): void => {
    const next = waiting.shift();
    if (next) next();
  };
  return async <T>(task: () => Promise<T>): Promise<T> => {
    if (active >= maximum) await new Promise<void>((resolve) => waiting.push(resolve));
    active += 1;
    try {
      return await task();
    } finally {
      active -= 1;
      runNext();
    }
  };
}

class HttpRequestError extends Error {
  constructor(message: string, readonly status: number | null = null) {
    super(message);
  }
}

async function withRetry<T>(
  label: string,
  retryCount: number,
  execute: () => Promise<T>,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retryCount; attempt += 1) {
    try {
      return await execute();
    } catch (error) {
      lastError = error;
      const status = error instanceof HttpRequestError ? error.status : null;
      if (attempt === retryCount || (status !== null && status >= 400 && status < 500)) break;
      const message = error instanceof Error ? error.message : "未知错误";
      console.warn(`↻ ${label} 失败，将在 ${attempt * 500}ms 后重试（${attempt}/${retryCount - 1}）：${message}`);
      await new Promise<void>((resolve) => setTimeout(resolve, attempt * 500));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`${label} 失败`);
}

async function uploadImage(
  assetUrl: string,
  token: string,
  asset: PreparedAsset,
  options: SyncOptions,
): Promise<string> {
  return withRetry(`图片 ${asset.key}`, options.retryCount, async () => {
    const imageBuffer = fs.readFileSync(asset.filePath);
    const formData = new FormData();
    formData.append(
      "image",
      new Blob([new Uint8Array(imageBuffer)], { type: asset.mimeType }),
      path.basename(asset.filePath),
    );
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.requestTimeoutMs);
    try {
      const response = await fetch(assetUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        signal: controller.signal,
      });
      const rawPayload: unknown = await response.json().catch(() => null);
      const parsed = AssetSyncResponseSchema.safeParse(rawPayload);
      if (!response.ok || !parsed.success) {
        throw new HttpRequestError(
          parsed.success
            ? parsed.data.message
            : `图片上传失败（HTTP ${response.status}）：${asset.key}`,
          response.status,
        );
      }
      return parsed.data.data.url;
    } catch (error) {
      if (error instanceof HttpRequestError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `请求超时（${Math.ceil(options.requestTimeoutMs / 1000)} 秒）`,
          { cause: error },
        );
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  });
}

function replaceEmbeddedImages(
  content: string,
  notePath: string,
  notebookDirectory: string,
  assetUrls: ReadonlyMap<string, string>,
): string {
  const resolveUrl = (reference: string): string | null => {
    const imagePath = resolveLocalImage(notebookDirectory, notePath, reference);
    return imagePath ? assetUrls.get(getAssetKey(notebookDirectory, imagePath)) || null : null;
  };
  let replaced = content.replace(
    /!\[([^\]]*)\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g,
    (fullMatch, alt: string, bracketedReference: string | undefined, plainReference: string | undefined) => {
      const url = resolveUrl(bracketedReference || plainReference || "");
      return url ? `![${alt}](${url})` : fullMatch;
    },
  );
  replaced = replaced.replace(
    /!\[\[([^\]|#]+)(?:#[^|\]]*)?(?:\|[^\]]*)?\]\]/g,
    (fullMatch, reference: string) => {
      const url = resolveUrl(reference);
      return url ? `![](${url})` : fullMatch;
    },
  );
  return replaced;
}

function collectPreparedAssets(
  candidates: ReadonlyArray<Omit<NoteCandidate, "hash">>,
  notebookDirectory: string,
  state: SyncState,
  options: SyncOptions,
  warnings: string[],
): Map<string, PreparedAsset> {
  const assets = new Map<string, PreparedAsset>();
  const missingWarnings = new Set<string>();
  for (const candidate of candidates) {
    for (const reference of extractImageReferences(candidate.body)) {
      if (isRemoteReference(reference)) continue;
      const imagePath = resolveLocalImage(notebookDirectory, candidate.payload.sourcePath ? path.join(notebookDirectory, candidate.payload.sourcePath) : notebookDirectory, reference);
      if (!imagePath) {
        const ext = path.extname(reference.split(/[?#]/, 1)[0] || "").toLowerCase();
        const warning = `未找到图片：${reference}（来自 ${candidate.payload.sourcePath}）`;
        if (IMAGE_MIME_TYPES[ext] && !missingWarnings.has(warning)) {
          missingWarnings.add(warning);
          warnings.push(warning);
        }
        continue;
      }
      const key = getAssetKey(notebookDirectory, imagePath);
      if (assets.has(key)) continue;
      const ext = path.extname(imagePath).toLowerCase();
      const mimeType = IMAGE_MIME_TYPES[ext];
      if (!mimeType) continue;
      const size = fs.statSync(imagePath).size;
      const hash = sha256(fs.readFileSync(imagePath));
      const cached = state.assets[key];
      assets.set(key, {
        key,
        filePath: imagePath,
        hash,
        size,
        mimeType,
        upload: size <= options.maxImageSizeBytes && cached?.hash !== hash,
      });
    }
  }
  return assets;
}

async function createPayloads(
  notebookDirectory: string,
  assetUrl: string,
  token: string,
  state: SyncState,
  options: SyncOptions,
  persistState: () => void,
): Promise<PayloadResult> {
  let skipped = 0;
  let filledEmptyNotes = 0;
  const warnings: string[] = [];
  const candidates: Array<Omit<NoteCandidate, "hash">> = [];
  const files = collectMarkdownFiles(notebookDirectory, notebookDirectory);

  for (const file of files) {
    if (isPrivatePath(file.relativePath)) {
      skipped += 1;
      continue;
    }
    const rawContent = fs.readFileSync(file.fullPath, "utf8");
    const { frontmatter, body } = parseFrontmatter(rawContent);
    if (frontmatter.draft || frontmatter.private) {
      skipped += 1;
      continue;
    }
    const filename = path.basename(file.fullPath, path.extname(file.fullPath));
    const metadata = extractMetadata(body, filename, frontmatter);
    if (!body.trim()) filledEmptyNotes += 1;
    candidates.push({
      payload: {
        ...metadata,
        slug: makeSlug(filename, file.relativePath),
        sourcePath: toPosixPath(file.relativePath),
        directoryPath:
          path.dirname(file.relativePath) === "."
            ? null
            : toPosixPath(path.dirname(file.relativePath)),
        tags: frontmatter.tags,
      },
      body: body.trim() ? body : `# ${metadata.title}\n`,
    });
  }

  const assets = collectPreparedAssets(candidates, notebookDirectory, state, options, warnings);
  const assetFingerprints = new Map<string, string>(
    [...assets.values()].map((asset) => [asset.key, asset.hash]),
  );
  const notesWithHash = candidates.map((candidate): NoteCandidate => {
    const dependencies = extractImageReferences(candidate.body)
      .map((reference) => {
        const imagePath = resolveLocalImage(
          notebookDirectory,
          path.join(notebookDirectory, candidate.payload.sourcePath),
          reference,
        );
        return imagePath
          ? `${getAssetKey(notebookDirectory, imagePath)}:${assetFingerprints.get(getAssetKey(notebookDirectory, imagePath)) || "missing"}`
          : reference;
      })
      .sort()
      .join("|");
    return { ...candidate, hash: sha256(`${candidate.body}\n--assets--\n${dependencies}`) };
  });
  const changedCandidates = notesWithHash.filter(
    (candidate) => options.forceFull || state.notes[candidate.payload.sourcePath]?.hash !== candidate.hash,
  );

  const uploadCandidates = [...assets.values()].filter((asset) => asset.upload);
  const assetUrls = new Map<string, string>();
  for (const asset of assets.values()) {
    const cached = state.assets[asset.key];
    if (cached?.hash === asset.hash) assetUrls.set(asset.key, cached.url);
  }
  const imageStats: ImageStats = {
    referenced: assets.size,
    uploaded: 0,
    reused: assetUrls.size,
    skippedOversized: [...assets.values()].filter((asset) => asset.size > options.maxImageSizeBytes).length,
  };
  for (const asset of assets.values()) {
    if (asset.size > options.maxImageSizeBytes) {
      warnings.push(`跳过超大图片：${asset.key}（${(asset.size / 1024 / 1024).toFixed(2)} MB，限制 ${(options.maxImageSizeBytes / 1024 / 1024).toFixed(0)} MB）`);
    }
  }

  if (uploadCandidates.length > 0) {
    console.log(`🖼️ 开始上传 ${uploadCandidates.length} 张新建或已修改图片（并发 ${options.uploadConcurrency}）`);
    const limit = createConcurrencyLimiter(options.uploadConcurrency);
    let completed = 0;
    await Promise.all(uploadCandidates.map((asset) => limit(async () => {
      console.log(`⬆️ 图片 ${completed + 1}/${uploadCandidates.length} 正在传输：${asset.key}`);
      const url = await uploadImage(assetUrl, token, asset, options);
      assetUrls.set(asset.key, url);
      state.assets[asset.key] = { hash: asset.hash, url };
      persistState();
      completed += 1;
      imageStats.uploaded += 1;
      console.log(`✅ 图片 ${completed}/${uploadCandidates.length} 已完成：${asset.key}`);
    })));
  }

  const allNotes = notesWithHash.map((candidate): NoteWithHash => ({
    hash: candidate.hash,
    payload: {
      ...candidate.payload,
      content: replaceEmbeddedImages(
        candidate.body,
        path.join(notebookDirectory, candidate.payload.sourcePath),
        notebookDirectory,
        assetUrls,
      ),
    },
  }));
  const changedSourcePaths = new Set(changedCandidates.map((candidate) => candidate.payload.sourcePath));
  return {
    directories: createDirectories(allNotes.map((note) => ({ relativePath: note.payload.sourcePath }))),
    allNotes,
    changedNotes: allNotes.filter((note) => changedSourcePaths.has(note.payload.sourcePath)),
    skipped,
    filledEmptyNotes,
    imageStats,
    warnings,
  };
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push([...items.slice(index, index + size)]);
  }
  return batches;
}

async function syncBatch(
  url: string,
  token: string,
  notes: SyncNotePayload[],
  directories: DirectoryPayload[],
  options: SyncOptions,
): Promise<SyncResponse> {
  return withRetry("笔记同步请求", options.retryCount, async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.requestTimeoutMs);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directories, notes }),
        signal: controller.signal,
      });
      const rawPayload: unknown = await response.json().catch(() => null);
      const parsed = SyncResponseSchema.safeParse(rawPayload);
      if (!response.ok || !parsed.success) {
        throw new HttpRequestError(
          parsed.success
            ? parsed.data.message
            : `同步接口请求失败（HTTP ${response.status}）`,
          response.status,
        );
      }
      return parsed.data as SyncResponse;
    } catch (error) {
      if (error instanceof HttpRequestError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `笔记同步请求超时（${Math.ceil(options.requestTimeoutMs / 1000)} 秒）`,
          { cause: error },
        );
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  });
}

async function main(): Promise<void> {
  loadLocalEnvironment();
  const notebookDirectoryArgument = process.argv
    .slice(2)
    .find((argument) => !argument.startsWith("--"));
  const notebookDirectory =
    process.env.NOTEBOOK_DIR ||
    notebookDirectoryArgument ||
    DEFAULT_NOTEBOOK_DIR;
  const syncUrl = process.env.NOTE_SYNC_URL || DEFAULT_SYNC_URL;
  const assetUrl =
    process.env.NOTE_SYNC_ASSET_URL || `${syncUrl.replace(/\/$/, "")}/assets`;
  const syncToken =
    process.env.NOTE_SYNC_TOKEN || process.env.NUXT_NOTE_SYNC_TOKEN;
  const configuredBatchSize = Number.parseInt(
    process.env.NOTE_SYNC_BATCH_SIZE || "",
    10,
  );
  const batchSize =
    Number.isInteger(configuredBatchSize) &&
    configuredBatchSize > 0 &&
    configuredBatchSize <= 50
      ? configuredBatchSize
      : DEFAULT_BATCH_SIZE;
  const options = getSyncOptions();
  const stateFile = path.resolve(
    process.env.NOTE_SYNC_STATE_FILE || DEFAULT_SYNC_STATE_FILE,
  );

  if (!syncToken || syncToken.length < 32) {
    throw new Error(
      "缺少或过弱的 NOTE_SYNC_TOKEN（至少 32 个字符），请先在 .env 中配置",
    );
  }
  if (!fs.existsSync(notebookDirectory))
    throw new Error(`未找到笔记目录：${notebookDirectory}`);

  const preflightWarnings: string[] = [];
  const state = loadSyncState(stateFile, preflightWarnings);
  console.log(`🌐 同步地址：${syncUrl}`);
  console.log("🔎 正在扫描 Markdown 与图片变更...");
  const {
    directories,
    allNotes,
    changedNotes,
    skipped,
    filledEmptyNotes,
    imageStats,
    warnings,
  } = await createPayloads(
    notebookDirectory,
    assetUrl,
    syncToken,
    state,
    options,
    () => saveSyncState(stateFile, state),
  );
  let created = 0;
  let updated = 0;
  const batches = chunk(changedNotes, batchSize);
  console.log(
    `📚 扫描及图片处理完成：${allNotes.length} 篇笔记，${changedNotes.length} 篇待同步，${directories.length} 个分类，${imageStats.referenced} 张图片，${skipped} 篇已跳过`,
  );
  console.log(
    `🧠 增量状态：${stateFile}${options.forceFull ? "（--full：强制同步全部 Markdown）" : ""}`,
  );
  console.log(
    `🖼️ 图片：上传 ${imageStats.uploaded}，复用 ${imageStats.reused}，超限跳过 ${imageStats.skippedOversized}`,
  );
  if (filledEmptyNotes > 0)
    console.log(`📝 ${filledEmptyNotes} 篇空 Markdown 将以标题占位同步`);

  for (const [index, batch] of batches.entries()) {
    const result = await syncBatch(
      syncUrl,
      syncToken,
      batch.map((note) => note.payload),
      index === 0 ? directories : [],
      options,
    );
    created += result.data.created;
    updated += result.data.updated;
    for (const note of batch) state.notes[note.payload.sourcePath] = { hash: note.hash };
    saveSyncState(stateFile, state);
    console.log(
      `✅ 已完成批次 ${index + 1}/${batches.length}（新增 ${result.data.created}，更新 ${result.data.updated}）`,
    );
  }
  if (batches.length === 0) console.log("✨ 没有 Markdown 或图片变更，无需请求服务器");
  const activePaths = new Set(allNotes.map((note) => note.payload.sourcePath));
  state.notes = Object.fromEntries(
    Object.entries(state.notes).filter(([sourcePath]) => activePaths.has(sourcePath)),
  );
  saveSyncState(stateFile, state);
  for (const warning of [...preflightWarnings, ...warnings]) console.warn(`⚠️ ${warning}`);
  console.log(
    `🎉 同步完成：新增 ${created} 篇，更新 ${updated} 篇，跳过 ${skipped} 篇`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "未知同步错误";
  console.error(`❌ 同步失败：${message}`);
  process.exitCode = 1;
});
