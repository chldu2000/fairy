package top.afool.fairy.common.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class FairyPR extends PullRequest {
    private VCSType vcsType;
}
