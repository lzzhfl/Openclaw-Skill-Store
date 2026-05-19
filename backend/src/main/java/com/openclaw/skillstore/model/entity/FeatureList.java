package com.openclaw.skillstore.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "feature_lists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeatureList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "feature_name", nullable = false, length = 500)
    private String featureName;

    @Column(name = "expected_behavior", columnDefinition = "TEXT")
    private String expectedBehavior;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}
