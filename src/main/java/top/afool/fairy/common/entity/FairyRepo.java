package top.afool.fairy.common.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class FairyRepo extends Repository {
    private Boolean fairyEnabled;
    private Boolean intelligenceEnabled;
}
