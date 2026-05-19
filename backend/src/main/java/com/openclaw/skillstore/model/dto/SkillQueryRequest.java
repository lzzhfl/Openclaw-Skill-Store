package com.openclaw.skillstore.model.dto;

import lombok.Data;

@Data
public class SkillQueryRequest {
    private String query;
    private Long categoryId;
    private String securityLevel;
    private String platform;
    private String tag;
    private String sortBy;
    private Boolean featured;
    private int page = 0;
    private int size = 20;
}
