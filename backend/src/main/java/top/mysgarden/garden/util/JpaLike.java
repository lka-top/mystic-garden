package top.mysgarden.garden.util;

/** Escapes user supplied text for SQL LIKE patterns using {@code !} as the escape character. */
public final class JpaLike {

    public static final char ESCAPE = '!';

    private JpaLike() {
    }

    public static String escape(String value) {
        return value.replace("!", "!!")
                .replace("%", "!%")
                .replace("_", "!_");
    }

    public static String contains(String value) {
        return "%" + escape(value) + "%";
    }
}
