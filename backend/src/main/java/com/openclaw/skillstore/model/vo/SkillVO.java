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
public class SkillVO {
    private Long id;
    private String name;
    private String slug;
    private String shortDescription;
    private String iconUrl;
    private String version;
    private String securityLevel;
    private Long downloadsCount;
    private Double ratingAvg;
    private Integer ratingCount;
    private String categoryName;
    private String authorName;
    private List<String> tags;
    private List<String> platforms;
    private LocalDateTime createdAt;
}
