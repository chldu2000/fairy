package top.afool.fairy.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import top.afool.fairy.intelligence.IntelligenceAppConfig;
import top.afool.fairy.listener.ListenerAppConfig;
import top.afool.fairy.service.ServiceAppConfig;

@SpringBootApplication
@Import({
		ServiceAppConfig.class,
		ListenerAppConfig.class,
		IntelligenceAppConfig.class
})
@EnableMongoRepositories("top.afool.fairy.common.repository")
public class FairyApplication {

	public static void main(String[] args) {
		SpringApplication.run(FairyApplication.class, args);
	}

}
