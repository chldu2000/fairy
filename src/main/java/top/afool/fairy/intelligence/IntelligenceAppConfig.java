package top.afool.fairy.intelligence;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnExpression("'${app}'.equals('ai')")
@ComponentScan("top.afool.fairy.intelligence")
public class IntelligenceAppConfig {
}
