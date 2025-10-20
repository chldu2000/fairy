package top.afool.fairy.common.service;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import top.afool.fairy.common.entity.FairyTask;

import static top.afool.fairy.common.Constants.HEADER_TASK_STATUS;

@Service
public class FairyTaskProducer {
    @Autowired
    private KafkaTemplate<String, FairyTask> taskKafkaTemplate;

    public void send(String topic, FairyTask task) {
        ProducerRecord<String, FairyTask> record = new ProducerRecord<>(topic, task);
        record.headers().add(HEADER_TASK_STATUS, task.getStatus().name().getBytes());
        taskKafkaTemplate.send(record);
    }
}
