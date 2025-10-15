package top.afool.fairy.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import top.afool.fairy.common.entity.FairyPR;
import top.afool.fairy.common.entity.VCSType;
import top.afool.fairy.common.service.FairyDataManager;
import top.afool.fairy.external.GitHubClient;
import top.afool.fairy.external.VCSClient;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class PullRequestHandler {
    private final Map<VCSType, VCSClient> vcsClientMap = Map.of(VCSType.GITHUB, new GitHubClient()); //new HashMap<>();

    @Autowired
    FairyDataManager dataManager;

//    public PullRequestHandler() {
//        vcsClientMap.put(VCSType.GITHUB, new GitHubClient());
//    }

    public ResponseEntity<String> handlePullRequest(VCSType vcsType) {
        var vcsClient = vcsClientMap.get(vcsType);
        if (vcsClient == null) {
            return ResponseEntity.badRequest().body("不支持的VCS类型");
        }
        return ResponseEntity.ok(Objects.requireNonNull(vcsClient.listPRs().blockFirst()).toString());
    }

    public ResponseEntity<List<FairyPR>> getPullRequests(VCSType vcsType) {
        var vcsClient = vcsClientMap.get(vcsType);
        if (vcsClient == null) {
            return ResponseEntity.badRequest().body(null);
        }

        var pullRequests = vcsClient.listPRs().collectList().block();
        dataManager.saveFairyPRs(pullRequests);

        return ResponseEntity.ok(pullRequests);
    }
}
