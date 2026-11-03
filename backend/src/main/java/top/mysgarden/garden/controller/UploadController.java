package top.mysgarden.garden.controller;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.HexFormat;

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
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.service.StorageService;
import top.mysgarden.garden.util.AuthContext;
import top.mysgarden.garden.util.ImageTypeValidator;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Upload", description = "管理员图片上传与签名接口")
public class UploadController {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final StorageService storageService;

    @PostMapping("/upload")
    @Operation(summary = "服务端上传图片（最大 25MB）")
    public ApiResult<InteractionDtos.UploadResultDto> upload(HttpServletRequest servletRequest) throws IOException {
        AuthContext.requireAdmin();

        MultipartHttpServletRequest multipart =
                WebUtils.getNativeRequest(servletRequest, MultipartHttpServletRequest.class);
        if (multipart == null || multipart.getFileMap().isEmpty()) {
            throw BusinessException.badRequest("未接收到上传文件");
        }
        MultipartFile file = multipart.getFileMap().values().iterator().next();
        if (file == null) {
            throw BusinessException.badRequest("未接收到上传文件");
        }

        ImageTypeValidator.ValidatedImageType imageType =
                ImageTypeValidator.validate(file.getOriginalFilename(), file.getContentType());
        if (imageType == null) {
            throw BusinessException.badRequest("仅支持 JPG、PNG、WebP、GIF、AVIF 图片，且文件扩展名必须与类型一致");
        }

        byte[] bytes = file.getBytes();
        if (bytes.length == 0 || bytes.length > ImageTypeValidator.MAX_ADMIN_IMAGE_SIZE) {
            throw BusinessException.payloadTooLarge("单张图片必须介于 1 B 与 25 MB 之间");
        }
        if (!ImageTypeValidator.matchesContent(imageType, bytes)) {
            throw BusinessException.badRequest("图片文件内容与声明的类型不一致");
        }

        byte[] randomBytes = new byte[6];
        RANDOM.nextBytes(randomBytes);
        String randomName = System.currentTimeMillis() + "-" + HexFormat.of().formatHex(randomBytes) + imageType.ext();

        String publicUrl = storageService.upload(bytes, randomName, imageType.mimeType(), StorageService.Scope.ADMIN);
        return ApiResult.ok(
                new InteractionDtos.UploadResultDto(publicUrl, file.getOriginalFilename(), bytes.length),
                "图片上传成功");
    }

    @PostMapping("/uploads/sign")
    @Operation(summary = "获取对象存储浏览器直传签名（本地模式返回 503 触发前端回退服务端上传）")
    public ApiResult<Void> sign(@Valid @RequestBody InteractionDtos.DirectUploadSignRequest request) {
        AuthContext.requireAdmin();

        ImageTypeValidator.ValidatedImageType imageType =
                ImageTypeValidator.validate(request.filename().trim(), request.contentType().trim());
        if (imageType == null) {
            throw BusinessException.badRequest("仅支持 JPG、PNG、WebP、GIF、AVIF 图片，且文件扩展名必须与类型一致");
        }

        if (!storageService.supportsDirectUpload()) {
            throw BusinessException.serviceUnavailable("当前存储模式不支持浏览器直传，已切换为服务端上传模式");
        }
        throw BusinessException.serviceUnavailable("当前存储模式不支持浏览器直传，已切换为服务端上传模式");
    }
}
