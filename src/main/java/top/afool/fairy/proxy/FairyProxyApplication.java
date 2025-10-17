package top.afool.fairy.proxy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"top.afool.fairy.proxy", "top.afool.fairy.common"})
public class FairyProxyApplication {
    public static void main(String[] args) {
        SpringApplication.run(FairyProxyApplication.class, args);
    }
}
