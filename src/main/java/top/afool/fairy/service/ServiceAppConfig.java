package top.afool.fairy.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnExpression("'${app}'.equals('service')")
@ComponentScan("top.afool.fairy.service")
public class ServiceAppConfig {
}
