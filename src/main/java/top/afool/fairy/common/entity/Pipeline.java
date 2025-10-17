package top.afool.fairy.common.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import top.afool.fairy.common.enums.VCSType;

/**
 * repository from VCSs
 */
@Data
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
