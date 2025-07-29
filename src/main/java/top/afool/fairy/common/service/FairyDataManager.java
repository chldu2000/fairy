package top.afool.fairy.common.service;

import org.springframework.stereotype.Service;
import top.afool.fairy.common.entity.PullRequest;

@Service
public class FairyDataManager {

    /**
     * Check if Fairy is enabled for a pull request
     * @return {@code true} if enabled, {@code false} otherwise
     */
    public Boolean isFairyEnabled() {
        return false;
    }
}
