package com.openclaw.skillstore.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryVO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String iconUrl;
    private List<CategoryVO> children;
}
