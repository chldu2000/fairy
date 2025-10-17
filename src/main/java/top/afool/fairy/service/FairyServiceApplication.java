package top.afool.fairy.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"top.afool.fairy.service", "top.afool.fairy.common"})
@EnableMongoRepositories("top.afool.fairy.common.repository")
public class FairyServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FairyServiceApplication.class, args);
    }
}
