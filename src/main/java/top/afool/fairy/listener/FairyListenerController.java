package top.afool.fairy.listener;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/listener")
public class FairyListenerController {

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook() {
        return ResponseEntity.ok("Hello Fairy-listener!");
    }

    @GetMapping("/pull-requests/latest")
    public ResponseEntity<String> getLatestPullRequest() {
        return ResponseEntity.ok("Hello Fairy-listener!");
    }

}
