package top.afool.fairy.intelligence.endpoint;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FairyIntelligenceController {
    @GetMapping("/")
    public String index() {
        return "Hello Fairy Intelligence!";
    }
}
