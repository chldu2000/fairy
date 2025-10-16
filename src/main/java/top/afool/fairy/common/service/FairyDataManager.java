package top.afool.fairy.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.afool.fairy.common.entity.FairyPR;
import top.afool.fairy.common.repository.FairyPRRepo;

import java.util.List;

@Service
public class FairyDataManager {
    @Autowired
    FairyPRRepo fairyPRRepo;

    /**
     * Check if Fairy is enabled for a pull request
     * @return {@code true} if enabled, {@code false} otherwise
     */
    public Boolean isFairyEnabled() {
        return false;
    }

    public FairyPR getFairyPR(String prId) {
        return fairyPRRepo.findById(prId).orElse(null);
    }

    public FairyPR saveFairyPR(FairyPR fairyPR) {
        return fairyPRRepo.save(fairyPR);
    }

    public List<FairyPR> saveFairyPRs(List<FairyPR> fairyPRs) {
        return fairyPRRepo.saveAll(fairyPRs);
    }
}
