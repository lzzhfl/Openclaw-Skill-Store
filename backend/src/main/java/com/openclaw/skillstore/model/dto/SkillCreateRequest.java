package com.openclaw.skillstore.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class SkillCreateRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String shortDescription;
    @NotBlank
    private String description;
    @NotNull
    private Long categoryId;
    @NotBlank
    private String installCommand;
    private String version = "1.0.0";
    private List<String> tags;
    private List<String> platforms;
    private List<String> features;
}
