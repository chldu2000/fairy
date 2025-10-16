package top.afool.fairy.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import top.afool.fairy.common.entity.FairyTask;

@Service
public class FairyTaskProducer {
    @Autowired
    private KafkaTemplate<String, FairyTask> taskKafkaTemplate;

    public void send(FairyTask task) {
        taskKafkaTemplate.send("fairy-tasks", task);
    }
}
