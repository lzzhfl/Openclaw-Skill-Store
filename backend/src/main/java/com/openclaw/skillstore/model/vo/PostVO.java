package com.openclaw.skillstore.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostVO {
    private Long id;
    private String title;
    private String content;
    private String postType;
    private String authorName;
    private String authorAvatar;
    private Integer viewCount;
    private Integer replyCount;
    private Boolean isPinned;
    private LocalDateTime createdAt;
}
