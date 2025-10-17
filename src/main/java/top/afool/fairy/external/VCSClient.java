package top.afool.fairy.external;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import top.afool.fairy.common.entity.PullRequest;

public interface VCSClient {
    Flux<PullRequest> listPRs();

    Mono<PullRequest> getPR(Integer prId);
}
