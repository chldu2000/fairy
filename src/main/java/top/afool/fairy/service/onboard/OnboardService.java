package top.afool.fairy.service.onboard;

import org.springframework.stereotype.Service;
import top.afool.fairy.common.entity.Project;

@Service
public class OnboardService {
    public Boolean onboardProject(Project originalProject) {
        return originalProject.getProjectName() != null;
    }
}
