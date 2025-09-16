package top.afool.fairy.external;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import top.afool.fairy.common.entity.FairyPR;

public interface VCSClient {
    Flux<FairyPR> listPRs();

    Mono<FairyPR> getPR(Integer prId);
}
