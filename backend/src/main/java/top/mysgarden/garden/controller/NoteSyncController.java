package top.mysgarden.garden.controller;

import java.io.IOException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.util.WebUtils;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.dto.NoteDtos;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.service.NoteSyncService;
import top.mysgarden.garden.service.StorageService;
import top.mysgarden.garden.util.ImageTypeValidator;
import top.mysgarden.garden.util.SlugUtils;

@RestController
@RequestMapping("/api/v1/notes/sync")
@RequiredArgsConstructor
@Tag(name = "NoteSync", description = "本地 Markdown 知识库增量同步接口（使用独立 NOTE_SYNC_TOKEN）")
public class NoteSyncController {

    private final NoteSyncService noteSyncService;
    private final StorageService storageService;

    @PostMapping
    @Operation(summary = "批量同步目录与笔记（幂等 Upsert）")
    public ApiResult<NoteDtos.NoteSyncResultDto> sync(@Valid @RequestBody NoteDtos.NoteSyncRequest request) {
        NoteDtos.NoteSyncResultDto result = noteSyncService.syncNotes(request);
        String msg = String.format("笔记同步完成：新增 %d 篇，更新 %d 篇", result.created(), result.updated());
        return ApiResult.ok(result, msg);
    }

    @PostMapping("/assets")
    @Operation(summary = "同步上传笔记内嵌图片（按 SHA-256 命名，最大 10MB，禁 SVG）")
    public ApiResult<InteractionDtos.UploadResultDto> uploadAsset(HttpServletRequest servletRequest) throws IOException {
        MultipartHttpServletRequest multipart =
                WebUtils.getNativeRequest(servletRequest, MultipartHttpServletRequest.class);
        if (multipart == null) {
            throw BusinessException.badRequest("未接收到笔记图片");
        }
        MultipartFile file = multipart.getFile("image");
        if (file == null || file.getOriginalFilename() == null || file.getOriginalFilename().isBlank()) {
            throw BusinessException.badRequest("未接收到笔记图片");
        }

        ImageTypeValidator.ValidatedImageType imageType =
                ImageTypeValidator.validate(file.getOriginalFilename(), file.getContentType());
        if (imageType == null || ".svg".equals(imageType.ext())) {
            throw BusinessException.badRequest("仅支持 JPG、PNG、WebP、GIF、AVIF 图片");
        }

        byte[] bytes = file.getBytes();
        if (bytes.length == 0 || bytes.length > ImageTypeValidator.MAX_NOTE_IMAGE_SIZE) {
            throw BusinessException.payloadTooLarge("单张笔记图片必须介于 1 B 与 10 MB 之间");
        }
        if (!ImageTypeValidator.matchesContent(imageType, bytes)) {
            throw BusinessException.badRequest("图片文件内容与声明的类型不一致");
        }

        String contentHash = SlugUtils.sha256Hex(bytes);
        String filename = "notes-" + contentHash + imageType.ext();
        String url = storageService.upload(bytes, filename, imageType.mimeType(), StorageService.Scope.NOTES);
        return ApiResult.ok(new InteractionDtos.UploadResultDto(url, filename, bytes.length), "笔记图片同步成功");
    }
}
