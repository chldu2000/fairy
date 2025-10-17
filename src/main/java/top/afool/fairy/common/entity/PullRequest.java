package top.afool.fairy.common.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import top.afool.fairy.common.enums.VCSType;

@Data
@Builder
@NoArgsConstructor // for mongo deserialization
@AllArgsConstructor
@Document(collection = "PullRequest")
public class PullRequest {
    @Id
    private String prID;
    private VCSType vcsType;
    private String url;
    private String project;
    private String fromRepo;
    private String toRepo;
    private Integer prNumber;
    private String version;
    private String fromBranch;
    private String toBranch;
    private String title;
    private String description;
    private String author;
    private String authorEmail;
}
