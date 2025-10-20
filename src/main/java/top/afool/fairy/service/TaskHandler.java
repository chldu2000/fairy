package top.afool.fairy.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import top.afool.fairy.common.entity.FairyTask;
import top.afool.fairy.common.enums.FairyTaskStatus;

import java.util.Arrays;

import static top.afool.fairy.common.Constants.HEADER_TASK_STATUS;
import static top.afool.fairy.common.enums.FairyTaskStatus.CREATED;

@Slf4j
@Service
public class TaskHandler {
    @KafkaListener(topics = "${kafka.topic.task.review-basic}")
    public void handleBasicReview(ConsumerRecord<String, FairyTask> record) {
        FairyTaskStatus status = FairyTaskStatus.valueOf(
                Arrays.toString(record.headers().lastHeader(HEADER_TASK_STATUS).value())
        );
        if (CREATED.equals(status)) {
            processTask(record.value());
        }
    }

    @KafkaListener(topics = "${kafka.topic.task.review-ai}")
    public void handleAIReview(ConsumerRecord<String, FairyTask> record) {
        FairyTaskStatus status = FairyTaskStatus.valueOf(
                Arrays.toString(record.headers().lastHeader(HEADER_TASK_STATUS).value())
        );
        switch (status) {
            case CANCELED, FAILED:
                // process ai review
                break;
            case FINISHED:
                // process ai review
                break;
            default:
                break;
        }
    }

    private void processTask(FairyTask task) {
        log.info("Task ID: {}, task type: {}", task.getTaskID(), task.getType());
    }
}
