package top.afool.fairy.common.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import top.afool.fairy.common.enums.FairyTaskStatus;
import top.afool.fairy.common.enums.FairyTaskType;

@Data
@Builder
public class FairyTask {
    @Id
    private String taskID;
    private FairyTaskType type;
    private FairyTaskStatus status;
    private String message;
}
