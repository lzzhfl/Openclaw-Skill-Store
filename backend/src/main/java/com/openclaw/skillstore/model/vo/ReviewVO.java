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
public class ReviewVO {
    private Long id;
    private Integer rating;
    private String content;
    private String username;
    private String userAvatar;
    private LocalDateTime createdAt;
}
