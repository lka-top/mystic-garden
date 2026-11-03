package top.mysgarden.garden.dto;

/**
 * 统一错误响应体，与 Nitro H3 错误结构对齐（前端读取 {@code err.data.statusMessage}）。
 */
public record ErrorBody(int statusCode, String statusMessage, String message) {

    public static ErrorBody of(int statusCode, String statusMessage) {
        return new ErrorBody(statusCode, statusMessage, statusMessage);
    }

    /** 供 Servlet Filter 层直接序列化输出。 */
    public String toJson() {
        return "{\"statusCode\":" + statusCode
                + ",\"statusMessage\":" + quote(statusMessage)
                + ",\"message\":" + quote(message) + "}";
    }

    private static String quote(String value) {
        if (value == null) {
            return "\"\"";
        }
        StringBuilder sb = new StringBuilder("\"");
        for (char c : value.toCharArray()) {
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        return sb.append('"').toString();
    }
}
