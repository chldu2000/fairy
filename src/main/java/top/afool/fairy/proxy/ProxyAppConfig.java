package top.afool.fairy.proxy;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnExpression("'${app}'.equals('proxy')")
@ComponentScan("top.afool.fairy.proxy")
public class ProxyAppConfig {
}
