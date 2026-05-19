package com.openclaw.skillstore.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillDetailVO {
    private Long id;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private String iconUrl;
    private String coverUrl;
    private String version;
    private String installCommand;
    private String tutorial;
    private String securityLevel;
    private String securityDescription;
    private Long downloadsCount;
    private Double ratingAvg;
    private Integer ratingCount;
    private String categoryName;
    private String categorySlug;
    private AuthorVO author;
    private List<String> tags;
    private List<String> platforms;
    private List<FeatureVO> features;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorVO {
        private Long id;
        private String username;
        private String avatarUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeatureVO {
        private String name;
        private String expectedBehavior;
    }
}
