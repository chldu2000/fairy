package top.afool.fairy.common;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Variables {
    @Value("${kafka.topic.task.review-basic}")
    public String TOPIC_TASK_BASIC;
    @Value("${kafka.topic.task.review-ai}")
    public String TOPIC_TASK_AI;

    private static Variables instance;

    @PostConstruct
    public void init() {
        instance = this;
    }

    public static String getTopicTaskBasic() {
        return instance.TOPIC_TASK_BASIC;
    }
}
