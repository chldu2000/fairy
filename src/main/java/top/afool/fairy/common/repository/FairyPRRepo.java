package top.afool.fairy.common.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import top.afool.fairy.common.entity.FairyPR;

public interface FairyPRRepo extends MongoRepository<FairyPR, String> {
}
