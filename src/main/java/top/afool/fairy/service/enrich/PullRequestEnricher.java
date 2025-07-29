package top.afool.fairy.service.enrich;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.afool.fairy.common.service.FairyDataManager;

@Service
public class PullRequestEnricher {
    @Autowired
    private FairyDataManager fairyDataManager;

    public void handleEnrichMessage() {
        if (!fairyDataManager.isFairyEnabled()) {
            return;
        }

    }
}
