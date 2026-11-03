package top.mysgarden.garden;

import org.springframework.boot.SpringApplication;

public class TestGardenBackendApplication {

	public static void main(String[] args) {
		SpringApplication.from(GardenBackendApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
