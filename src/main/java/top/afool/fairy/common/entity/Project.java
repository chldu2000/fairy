package top.afool.fairy.common.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import top.afool.fairy.common.enums.VCSType;

/**
 * project or repo owner
 */
@Data
@Builder
@NoArgsConstructor // for mongo deserialization
@AllArgsConstructor
@Document(collection = "Project")
public class Project {
    @Id
    private String projectID;
    private VCSType vcsType;
    private String url;
    private String projectName;
    private Boolean fairyEnabled;
    private Boolean intelligenceEnabled;

    public static Project fromRawData() {
        return new Project();
    }

    public static Project giveMeAProjectForTest() {
        Project project = new Project();
        project.setUrl("https://github.com/chldu2000/fairy");
        project.setProjectName("fairy");
        project.setFairyEnabled(true);
        project.setIntelligenceEnabled(true);
        return project;
    }
}
