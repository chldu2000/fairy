package top.afool.fairy.service.service;

import org.springframework.stereotype.Service;
import top.afool.fairy.common.entity.FairyProject;
import top.afool.fairy.common.entity.Project;

@Service
public class OnboardService {
    public Boolean onboardProject(Project originalProject) {
        FairyProject project = FairyProject.fromRawData(originalProject);
        return project.getProjectName() != null;
    }
}
