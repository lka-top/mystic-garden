package top.mysgarden.garden.config;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;
import tools.jackson.databind.module.SimpleModule;

/**
 * JSON 序列化配置：
 * 1) {@link Instant} 固定输出 3 位毫秒 UTC ISO-8601（如 {@code 2026-09-11T07:34:01.570Z}），与 Prisma / JS Date.toISOString() 逐字节对齐；
 * 2) 保留 {@code null} 字段（{@link JsonInclude.Include#ALWAYS}），与 Prisma 对象字段保持一致。
 */
@Configuration
public class JacksonConfig {

    private static final DateTimeFormatter ISO_MILLIS_UTC = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            .withZone(ZoneOffset.UTC);

    @Bean
    public JsonMapperBuilderCustomizer instantMillisCustomizer() {
        SimpleModule timeModule = new SimpleModule("GardenInstantMillisModule");
        timeModule.addSerializer(Instant.class, new ValueSerializer<>() {
            @Override
            public void serialize(Instant value, JsonGenerator gen, SerializationContext ctxt) throws JacksonException {
                if (value == null) {
                    gen.writeNull();
                } else {
                    gen.writeString(ISO_MILLIS_UTC.format(value));
                }
            }
        });
        return builder -> builder
                .addModule(timeModule)
                .changeDefaultPropertyInclusion(incl -> incl
                        .withValueInclusion(JsonInclude.Include.ALWAYS)
                        .withContentInclusion(JsonInclude.Include.ALWAYS));
    }
}
