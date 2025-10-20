package top.afool.fairy.common.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import top.afool.fairy.common.enums.VCSType;

/**
 * code repository
 * differentiate from mongo repositories
 */
@Data
@Builder
@NoArgsConstructor // for mongo deserialization
@AllArgsConstructor
@Document(collection = "Pipeline")
public class Pipeline {
    @Id
    private String repoID;
    private VCSType vcsType;
    private String url;
    private String project;
    private String slug;
    private Boolean fairyEnabled;
    private Boolean intelligenceEnabled;
}
