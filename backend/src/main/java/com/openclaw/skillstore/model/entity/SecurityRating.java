package com.openclaw.skillstore.model.entity;

import com.openclaw.skillstore.common.SecurityLevel;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false, unique = true)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    @Builder.Default
    private SecurityLevel level = SecurityLevel.D;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rated_by")
    private User ratedBy;

    @Column(name = "report_url", length = 500)
    private String reportUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "rated_at", nullable = false)
    private LocalDateTime ratedAt;

    @PrePersist
    protected void onCreate() {
        ratedAt = LocalDateTime.now();
    }
}
