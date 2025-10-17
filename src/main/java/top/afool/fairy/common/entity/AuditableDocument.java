package top.afool.fairy.common.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;

public class AuditableDocument {
    @CreatedDate
    private Date createTime;
    @LastModifiedDate
    private Date updateTime;
}
