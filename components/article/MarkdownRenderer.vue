<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import taskLists from "markdown-it-task-lists";
import container from "markdown-it-container";
import { getHighlighter } from "shiki";

const props = defineProps<{
  content: string;
}>();

const emit = defineEmits<{
  (
    e: "tocReady",
    toc: Array<{ id: string; text: string; level: number }>,
  ): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const renderedHtml = ref("");
const tocList = ref<Array<{ id: string; text: string; level: number }>>([]);

// 基础 Markdown 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

// 1. 锚点插件
md.use(anchor, {
  permalink: anchor.permalink.ariaHidden({
    placement: "before",
    symbol: "#",
  }),
});

// 2. 任务清单插件
md.use(taskLists, {
  enabled: true,
  label: true,
  labelAfter: true,
});

// 3. 自定义 Callout 容器
const calloutTypes = ["tip", "info", "warning", "danger", "note"];
calloutTypes.forEach((type) => {
  md.use(container, type, {
    render: (tokens: any[], idx: number) => {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const info = token.info.trim().slice(type.length).trim();
        const title = info || type.charAt(0).toUpperCase() + type.slice(1);
        return `<div class="callout callout-${type} my-2.5 p-3 rounded-lg border text-sm leading-relaxed">\n<div class="callout-title font-bold mb-0.5 flex items-center gap-1.5">${title}</div>\n<div class="callout-content text-zinc-700 dark:text-zinc-300">\n`;
      } else {
        return "</div></div>\n";
      }
    },
  });
});

// 初始化 Shiki 高亮器 (单例)
let highlighterPromise: Promise<any> | null = null;

async function getSharedHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ["one-dark-pro"],
      langs: [
        "javascript",
        "typescript",
        "vue",
        "html",
        "css",
        "json",
        "sql",
        "bash",
        "shell",
        "markdown",
        "yaml",
        "prisma",
        "python",
        "go",
        "rust",
        "c",
        "cpp",
        "java",
      ],
    });
  }
  return highlighterPromise;
}

// 统一复制处理器（事件委托）
function handleContainerClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const copyBtn = target.closest(".copy-code-btn") as HTMLButtonElement | null;
  if (!copyBtn) return;

  const codeWrapper = copyBtn.closest(".code-block-wrapper");
  if (!codeWrapper) return;

  const rawCodeEl = codeWrapper.querySelector(
    ".raw-code-payload",
  ) as HTMLElement | null;
  const codeText = rawCodeEl?.dataset?.code
    ? decodeURIComponent(rawCodeEl.dataset.code)
    : codeWrapper.querySelector("code")?.textContent || "";

  if (!codeText) return;

  const originalContent = copyBtn.innerHTML;

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showSuccess();
    } catch {
      console.error("浏览器复制失败");
    }
    document.body.removeChild(textarea);
  };

  const showSuccess = () => {
    copyBtn.innerHTML = `
      <svg class="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span class="text-emerald-400 font-medium">已复制</span>
    `;
    setTimeout(() => {
      copyBtn.innerHTML = originalContent;
    }, 2000);
  };

  if (navigator?.clipboard?.writeText) {
    navigator.clipboard
      .writeText(codeText)
      .then(showSuccess)
      .catch(() => fallbackCopy(codeText));
  } else {
    fallbackCopy(codeText);
  }
}

async function renderContent() {
  if (!props.content) {
    renderedHtml.value = "";
    tocList.value = [];
    return;
  }

  // 1. 提取 TOC 目录
  const tokens = md.parse(props.content, {});
  const headings: Array<{ id: string; text: string; level: number }> = [];

  tokens.forEach((token, index) => {
    if (token.type === "heading_open") {
      const level = parseInt(token.tag.slice(1), 10);
      const nextToken = tokens[index + 1];
      const text = nextToken ? nextToken.content : "";
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-");
      headings.push({ id, text, level });
    }
  });

  tocList.value = headings;
  emit("tocReady", headings);

  // 2. 配置 Shiki 代码高亮器渲染函数（去除任何首尾换行与多余留白，高度随文本严格自适应）
  try {
    const hl = await getSharedHighlighter();
    md.options.highlight = (code: string, lang: string) => {
      const validLang =
        lang && hl.getLoadedLanguages().includes(lang) ? lang : "text";
      const cleanCode = code.replace(/^[\r\n]+|[\r\n]+$/g, ""); // 严格修剪首尾多余换行符
      const encodedCode = encodeURIComponent(cleanCode);
      try {
        const highlightedHtml = hl.codeToHtml(cleanCode, {
          lang: validLang,
          theme: "one-dark-pro",
          transformers: [
            {
              pre(node) {
                delete node.properties.style;
                node.properties.class =
                  "m-0 p-0 font-mono text-[12.5px] leading-tight overflow-x-auto bg-transparent";
              },
            },
          ],
        });

        return `<div class="code-block-wrapper relative my-1.5 rounded-md border border-zinc-800/90 bg-[#12141a] text-zinc-100 shadow-xs font-mono block w-full h-auto min-h-0 group">
          <!-- 极简顶栏：超低高度 (h-6) -->
          <div class="code-header flex items-center justify-between px-2.5 h-6 bg-[#171920] border-b border-zinc-800/80 select-none">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block"></span>
              <span class="text-[9px] font-bold tracking-widest text-zinc-400 uppercase font-mono">${validLang}</span>
            </div>
            <button type="button" class="copy-code-btn flex items-center gap-1 px-1 py-0.2 rounded text-[9.5px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer">
              <svg class="w-2.5 h-2.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>复制</span>
            </button>
          </div>

          <!-- 代码正文：内边距彻底归零 (仅留左右 px-2.5)，上下紧贴顶栏与底边框 -->
          <div class="code-body p-0 pl-3 pr-2 overflow-x-auto bg-transparent h-auto min-h-0">
            ${highlightedHtml}
          </div>
          <div class="raw-code-payload hidden" data-code="${encodedCode}"></div>
        </div>`;
      } catch {
        return `<div class="code-block-wrapper relative my-3 rounded-lg border border-zinc-800/90 bg-[#12141a] p-3 text-[12.5px] font-mono text-zinc-200 block w-full overflow-x-auto"><pre><code>${md.utils.escapeHtml(cleanCode)}</code></pre></div>`;
      }
    };
  } catch (err) {
    console.warn("Shiki 高亮器加载失败，降级为默认渲染:", err);
  }

  renderedHtml.value = md.render(props.content);
}

watch(() => props.content, renderContent, { immediate: true });

onMounted(() => {
  renderContent();
  if (containerRef.value) {
    containerRef.value.addEventListener("click", handleContainerClick);
  }
});

onBeforeUnmount(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener("click", handleContainerClick);
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="markdown-body prose prose-zinc dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-0 prose-pre:shadow-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl sm:prose-h1:3xl prose-h2:text-xl sm:prose-h2:2xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-brand-500/60 prose-blockquote:bg-brand-50/40 dark:prose-blockquote:bg-brand-950/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-mono prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800/80 prose-code:text-zinc-800 dark:prose-code:text-zinc-200 prose-code:border prose-code:border-zinc-200/60 dark:prose-code:border-zinc-700/60 prose-code:before:content-none prose-code:after:content-none prose-table:border-collapse prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800/60 prose-th:p-2.5 prose-td:p-2.5 prose-tr:border-b prose-tr:border-zinc-200/60 dark:prose-tr:border-zinc-800/60 prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-zinc-200/50 dark:prose-img:border-zinc-800/50"
    v-html="renderedHtml"
  />
</template>

<style>
/* 彻底清除 Tailwind Typography 默认的底层 pre 样式与边距 */
.markdown-body pre {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  height: auto !important;
  min-height: 0 !important;
}

/* Callout 提示块 */
.callout-tip,
.callout-note {
  @apply bg-emerald-50/60 border-emerald-200/80 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-900/60 dark:text-emerald-200;
}
.callout-tip .callout-title,
.callout-note .callout-title {
  @apply text-emerald-800 dark:text-emerald-400;
}

.callout-info {
  @apply bg-blue-50/60 border-blue-200/80 text-blue-950 dark:bg-blue-950/20 dark:border-blue-900/60 dark:text-blue-200;
}
.callout-info .callout-title {
  @apply text-blue-800 dark:text-blue-400;
}

.callout-warning {
  @apply bg-amber-50/60 border-amber-200/80 text-amber-950 dark:bg-amber-950/20 dark:border-amber-900/60 dark:text-amber-200;
}
.callout-warning .callout-title {
  @apply text-amber-800 dark:text-amber-400;
}

.callout-danger {
  @apply bg-rose-50/60 border-rose-200/80 text-rose-950 dark:bg-rose-950/20 dark:border-rose-900/60 dark:text-rose-200;
}
.callout-danger .callout-title {
  @apply text-rose-800 dark:text-rose-400;
}

/* 彻底清除代码块所有层级的多余高度与边距 */
.code-block-wrapper,
.code-block-wrapper .code-body,
.code-block-wrapper pre,
.code-block-wrapper pre code {
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
}

.code-block-wrapper pre {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  line-height: 1.4 !important;
}

.code-block-wrapper code {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 12.5px !important;
  line-height: 1.4 !important;
}

/* 关键：line 保持 inline，靠 pre 的 white-space 天然换行，杜绝 block 化导致 \n 双倍空行 */
.code-block-wrapper .line {
  padding: 0 !important;
  margin: 0 !important;
}

/* 待办清单样式 */
.contains-task-list {
  list-style-type: none !important;
  padding-left: 0.5rem !important;
}
.task-list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.task-list-item input[type="checkbox"] {
  @apply rounded border-zinc-300 dark:border-zinc-700 text-brand-600 focus:ring-brand-500;
}
</style>
