package top.mysgarden.garden;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@ConfigurationPropertiesScan
public class GardenBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GardenBackendApplication.class, args);
    }

}
