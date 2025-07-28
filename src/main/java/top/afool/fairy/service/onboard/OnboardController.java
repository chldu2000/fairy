package top.afool.fairy.service.onboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.afool.fairy.common.entity.Project;

@RestController
@RequestMapping("/onboard")
public class OnboardController {
    @Autowired
    private OnboardService onboardService;

    @PostMapping("/project")
    public ResponseEntity<String> onboardProject(@RequestBody Project project) {
        Boolean success = onboardService.onboardProject(project);
        return success
                ? ResponseEntity.ok("Onboard project successfully")
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Onboard project failed");
    }
}
