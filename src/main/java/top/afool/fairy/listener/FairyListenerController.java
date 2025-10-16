package top.afool.fairy.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.afool.fairy.common.entity.FairyPR;
import top.afool.fairy.common.enums.VCSType;

import java.util.List;

@RestController
@RequestMapping("/listener")
public class FairyListenerController {

    @Autowired
    private PullRequestHandler pullRequestHandler;

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook() {
        return ResponseEntity.ok("Hello Fairy-listener!");
    }

    @GetMapping("/pull-requests/github/latest")
    public ResponseEntity<List<FairyPR>> getGitHubLatestPullRequest() {
        return pullRequestHandler.getPullRequests(VCSType.GITHUB);
    }

}
