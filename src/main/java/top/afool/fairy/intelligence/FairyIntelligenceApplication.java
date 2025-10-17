package top.afool.fairy.intelligence;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"top.afool.fairy.intelligence", "top.afool.fairy.common"})
@EnableMongoRepositories("top.afool.fairy.common.repository")
public class FairyIntelligenceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FairyIntelligenceApplication.class, args);
    }
}
