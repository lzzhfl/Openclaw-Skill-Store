package com.openclaw.skillstore.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_tags", uniqueConstraints = @UniqueConstraint(columnNames = {"skill_id", "tag_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;
}
