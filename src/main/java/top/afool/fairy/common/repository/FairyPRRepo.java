package top.afool.fairy.common.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import top.afool.fairy.common.entity.PullRequest;

public interface FairyPRRepo extends MongoRepository<PullRequest, String> {
}
