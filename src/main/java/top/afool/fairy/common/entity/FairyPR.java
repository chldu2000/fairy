package top.afool.fairy.common.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import top.afool.fairy.common.enums.VCSType;

@Data
@SuperBuilder
@NoArgsConstructor // for mongo deserialization
@EqualsAndHashCode(callSuper = true)
@Document(collection = "FairyPullRequest")
public class FairyPR extends PullRequest {
    @Id
    private String prID;
    private VCSType vcsType;
}
