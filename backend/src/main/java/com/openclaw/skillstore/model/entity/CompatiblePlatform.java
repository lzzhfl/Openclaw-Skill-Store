package com.openclaw.skillstore.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "compatible_platforms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompatiblePlatform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "platform_name", nullable = false, length = 100)
    private String platformName;

    @Column(name = "min_version", length = 20)
    private String minVersion;
}
