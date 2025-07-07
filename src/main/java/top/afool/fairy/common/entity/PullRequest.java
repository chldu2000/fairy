package top.afool.fairy.common.entity;

import lombok.Data;

@Data
public class PullRequest {
    private String url;
    private String project;
    private String repo;
    private String prNumber;
    private String version;
    private String from;
    private String to;
    private String title;
    private String description;
    private String author;
    private String authorEmail;
    private VCSType vcsType;
}
