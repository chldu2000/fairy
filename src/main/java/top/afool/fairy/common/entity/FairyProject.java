package top.afool.fairy.common.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class FairyProject extends Project {
    private Boolean fairyEnabled;
    private Boolean intelligenceEnabled;

    public static FairyProject fromRawData(Project rawData) {
        FairyProject project = new FairyProject();
        project.setUrl(rawData.getUrl());
        project.setProjectName(rawData.getProjectName());
        // set this when doing onboarding
//        project.setFairyEnabled(rawData.isFairyEnabled());
//        project.setIntelligenceEnabled(rawData.isIntelligenceEnabled());
        return project;
    }

    public static FairyProject giveMeAProjectForTest() {
        FairyProject project = new FairyProject();
        project.setUrl("https://github.com/chldu2000/fairy");
        project.setProjectName("fairy");
        project.setFairyEnabled(true);
        project.setIntelligenceEnabled(true);
        return project;
    }
}
