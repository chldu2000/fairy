package top.afool.fairy.external;

import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import top.afool.fairy.common.entity.FairyPR;
import top.afool.fairy.common.enums.VCSType;

@Slf4j
@Component
public class GitHubClient implements VCSClient {

    WebClient webClient = WebClient.builder().build();

    private FairyPR toFairyPR(JSONObject githubPR) {

        var pr = FairyPR.builder()
                .url(githubPR.getStr("html_url"))
                .project(githubPR.getByPath("base.repo.owner.login", String.class))
                .fromRepo(githubPR.getByPath("head.repo.name", String.class))
                .toRepo(githubPR.getByPath("base.repo.name", String.class))
                .prNumber(githubPR.getInt("number"))
                .version(githubPR.getByPath("head.sha", String.class))
                .fromBranch(githubPR.getByPath("head.ref", String.class))
                .toBranch(githubPR.getByPath("base.ref", String.class))
                .title(githubPR.getStr("title"))
                .description(githubPR.getStr("body"))
                .author(githubPR.getByPath("user.login", String.class))
//                .authorEmail(githubPR.getStr("user", "email"))
                .vcsType(VCSType.GITHUB)
                .build();
        pr.setPrID(pr.getVcsType().name() + "/" + pr.getProject() + "/" + pr.getToRepo() + "/" + pr.getPrNumber() + "/" + pr.getVersion());
        return pr;
    }

    // list PRs under user/org: search api?
    @Override
    public Flux<FairyPR> listPRs() {
        var url = "https://api.github.com/repos/chldu2000/fairy/pulls";

        var headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + System.getenv("GITHUB_TOKEN"));
        headers.add("Accept", "application/vnd.github+json");


        var prs = webClient.get()
                .uri(url)
                .headers(hds -> hds.addAll(headers))
                .retrieve();

        return prs.bodyToFlux(JSONObject.class).map(this::toFairyPR);
    }

    @Override
    public Mono<FairyPR> getPR(Integer prId) {
        var url = "https://api.github.com/repos/chldu2000/fairy/pulls/" + prId;

        // add headers

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(JSONObject.class)
                .map(this::toFairyPR);
    }
}
