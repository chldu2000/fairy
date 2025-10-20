package top.afool.fairy.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import top.afool.fairy.common.Variables;
import top.afool.fairy.common.entity.PullRequest;
import top.afool.fairy.common.entity.FairyTask;
import top.afool.fairy.common.enums.FairyTaskStatus;
import top.afool.fairy.common.enums.FairyTaskType;
import top.afool.fairy.common.enums.VCSType;
import top.afool.fairy.common.service.FairyDataManager;
import top.afool.fairy.common.service.FairyTaskProducer;
import top.afool.fairy.external.GitHubClient;
import top.afool.fairy.external.VCSClient;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
public class PullRequestHandler {
    private final Map<VCSType, VCSClient> vcsClientMap = Map.of(VCSType.GITHUB, new GitHubClient()); //new HashMap<>();

    @Autowired
    FairyDataManager dataManager;

    @Autowired
    FairyTaskProducer taskProducer;

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

    public ResponseEntity<List<PullRequest>> getPullRequests(VCSType vcsType) {
        var vcsClient = vcsClientMap.get(vcsType);
        if (vcsClient == null) {
            return ResponseEntity.badRequest().body(null);
        }

        var pullRequests = vcsClient.listPRs().collectList().block();
        pullRequests = pullRequests.stream().filter(pr -> dataManager.getFairyPR(pr.getPrID()) == null).toList();
        dataManager.saveFairyPRs(pullRequests);
        pullRequests.forEach(this::createReviewTask);

        return ResponseEntity.ok(pullRequests);
    }

    private void createReviewTask(PullRequest pullRequest) {
        try {
            taskProducer.send(Variables.getTopicTaskBasic(),
                    FairyTask.builder()
                    .taskID(pullRequest.getPrID())
                    .type(FairyTaskType.REVIEW_BASIC)
                    .status(FairyTaskStatus.CREATED)
                    .message("Pull request created")
                    .build());
        } catch (Exception e) {
            log.error("Failed to create review task for pull request {}", pullRequest.getPrID(), e);
        }
    }
}
