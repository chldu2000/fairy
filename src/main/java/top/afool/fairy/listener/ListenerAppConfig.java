package top.afool.fairy.listener;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnExpression("'${app}'.equals('listener')")
@ComponentScan(basePackages = {"top.afool.fairy.listener", "top.afool.fairy.common"})
public class ListenerAppConfig {
}
