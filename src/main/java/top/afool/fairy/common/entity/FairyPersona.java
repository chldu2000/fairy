package top.afool.fairy.common.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FairyPersona {
    private String name;
    private String description;
    private String avatar;
    private String prompt;
}
