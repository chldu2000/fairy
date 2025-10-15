package top.afool.fairy.common.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Document(collection = "FairyPullRequest")
public class FairyPR extends PullRequest {
    private VCSType vcsType;
}
