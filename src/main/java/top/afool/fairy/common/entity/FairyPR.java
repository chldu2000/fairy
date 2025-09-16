package top.afool.fairy.common.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class FairyPR extends PullRequest {
    private VCSType vcsType;
}
