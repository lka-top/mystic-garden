package top.mysgarden.garden.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3 文档配置（参照 OpenIsle {@code OpenApiConfig}）。
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI(AppProperties properties) {
        SecurityScheme jwtScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("Authorization");

        return new OpenAPI()
                .info(new Info()
                        .title(properties.siteName() + " API")
                        .description(properties.siteDescription())
                        .version("v1"))
                .components(new Components().addSecuritySchemes("JWT", jwtScheme))
                .addSecurityItem(new SecurityRequirement().addList("JWT"));
    }
}
