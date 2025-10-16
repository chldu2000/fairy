package top.afool.fairy.common.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class PullRequest {
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
