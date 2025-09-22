package top.afool.fairy.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnExpression("'${app}'.equals('service')")
@ComponentScan(basePackages = {"top.afool.fairy.service", "top.afool.fairy.common"})
public class ServiceAppConfig {
}
