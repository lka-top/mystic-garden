package top.mysgarden.garden.service;

/**
 * 文件存储服务抽象（当前生产启用本地持久化目录，未来可按需扩展 OSS 实现）。
 */
public interface StorageService {

    enum Scope {
        ADMIN("admin"),
        NOTES("notes");

        private final String dirName;

        Scope(String dirName) {
            this.dirName = dirName;
        }

        public String dirName() {
            return dirName;
        }
    }

    /**
     * 将字节内容写入目标存储并返回公开访问 URL。
     */
    String upload(byte[] data, String filename, String mimeType, Scope scope, String explicitObjectKey);

    default String upload(byte[] data, String filename, String mimeType, Scope scope) {
        return upload(data, filename, mimeType, scope, null);
    }

    /** 是否支持浏览器签名直传（本地存储模式返回 false）。 */
    boolean supportsDirectUpload();
}
