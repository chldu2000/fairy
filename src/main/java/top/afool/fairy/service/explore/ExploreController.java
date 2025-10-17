package top.afool.fairy.service.explore;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.afool.fairy.common.entity.Project;
import top.afool.fairy.common.entity.Pipeline;

import java.util.List;

@RestController
@RequestMapping("/explore")
public class ExploreController {
    @GetMapping("/project")
    public ResponseEntity<List<Project>> getAllProjects(@RequestParam(required = false) Boolean includeInactive) {
        return ResponseEntity.ok(List.of(Project.giveMeAProjectForTest()));
    }

    @GetMapping("/project/{projectName}")
    public ResponseEntity<Project> getProjectByName(String projectName) {
        return ResponseEntity.ok(new Project());
    }

    @GetMapping("/repository")
    public ResponseEntity<List<Pipeline>> getAllRepositories() {
        return ResponseEntity.ok(List.of(new Pipeline()));
    }

    @GetMapping("/repository/{repositoryName}")
    public ResponseEntity<List<Pipeline>> getRepositoryByName(String repositoryName) {
        return ResponseEntity.ok(List.of(new Pipeline()));
    }
}
