package top.afool.fairy.service.explore;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.afool.fairy.common.entity.FairyProject;
import top.afool.fairy.common.entity.FairyRepo;

import java.util.List;

@RestController
@RequestMapping("/explore")
public class ExploreController {
    @GetMapping("/project")
    public ResponseEntity<List<FairyProject>> getAllProjects(@RequestParam(required = false) Boolean includeInactive) {
        return ResponseEntity.ok(List.of(FairyProject.giveMeAProjectForTest()));
    }

    @GetMapping("/project/{projectName}")
    public ResponseEntity<FairyProject> getProjectByName(String projectName) {
        return ResponseEntity.ok(new FairyProject());
    }

    @GetMapping("/repository")
    public ResponseEntity<List<FairyRepo>> getAllRepositories() {
        return ResponseEntity.ok(List.of(new FairyRepo()));
    }

    @GetMapping("/repository/{repositoryName}")
    public ResponseEntity<List<FairyRepo>> getRepositoryByName(String repositoryName) {
        return ResponseEntity.ok(List.of(new FairyRepo()));
    }
}
