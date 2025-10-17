package top.afool.fairy.listener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"top.afool.fairy.listener", "top.afool.fairy.common"})
@EnableMongoRepositories("top.afool.fairy.common.repository")
public class FairyListenerApplication {
    public static void main(String[] args) {
        SpringApplication.run(FairyListenerApplication.class, args);
    }
}
