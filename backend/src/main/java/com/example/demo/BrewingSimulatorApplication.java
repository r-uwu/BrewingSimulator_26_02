package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
//@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class BrewingSimulatorApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrewingSimulatorApplication.class, args);
	}

}
