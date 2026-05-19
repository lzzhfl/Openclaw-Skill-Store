package com.openclaw.skillstore.config;

import com.openclaw.skillstore.common.SecurityLevel;
import com.openclaw.skillstore.common.UserRole;
import com.openclaw.skillstore.model.entity.*;
import com.openclaw.skillstore.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SkillRepository skillRepository;
    private final TagRepository tagRepository;
    private final SkillTagRepository skillTagRepository;
    private final SecurityRatingRepository securityRatingRepository;
    private final CompatiblePlatformRepository compatiblePlatformRepository;
    private final FeatureListRepository featureListRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("=== Initializing seed data ===");

        User admin = createUser("admin", "admin@skillstore.com", "admin123", UserRole.ADMIN);
        User author = createUser("author", "author@skillstore.com", "author123", UserRole.AUTHOR);
        User user = createUser("demo", "demo@skillstore.com", "demo123", UserRole.USER);

        Category devCat = createCategory("Development", "development", null, 0);
        Category aiCat = createCategory("AI & ML", "ai-ml", null, 1);
        Category officeCat = createCategory("Office Tools", "office-tools", null, 2);
        Category designCat = createCategory("Design", "design", null, 3);

        Tag aiTag = createTag("AI");
        Tag webTag = createTag("Web");
        Tag dataTag = createTag("Data");
        Tag securityTag = createTag("Security");

        createSkill("Claude Code Assistant",
            "claude-code-assistant",
            "Enhance your Claude Code experience with advanced code generation and refactoring capabilities",
            "### Claude Code Assistant\n\nA powerful skill that supercharges Claude Code with advanced features:\n- Intelligent code completion\n- Automated refactoring\n- Context-aware suggestions\n- Multi-file editing support",
            aiCat, author, "curl -sSL https://skill.store/install/claude-assistant | bash",
            List.of("AI", "Web"), List.of("Claude Code", "VS Code", "Cursor"),
            List.of("Navigate to Claude Code interface", "Open a project file", "Type a code prompt", "Verify AI generates correct code"),
            SecurityLevel.A);

        createSkill("PDF Document Processor",
            "pdf-document-processor",
            "Parse, extract, and manipulate PDF documents with AI-powered analysis",
            "### PDF Document Processor\n\nHandle all your PDF needs:\n- Text extraction with OCR\n- Table recognition\n- Form filling automation\n- Document summarization",
            officeCat, author, "curl -sSL https://skill.store/install/pdf-processor | bash",
            List.of("Data"), List.of("Claude Code", "Openclaw"),
            List.of("Upload a PDF file", "Select extraction mode", "Verify text extraction accuracy"),
            SecurityLevel.B);

        createSkill("Web Scraper Pro",
            "web-scraper-pro",
            "Extract structured data from any website with configurable crawling rules",
            "### Web Scraper Pro\n\nProfessional web scraping skill:\n- Configurable crawling rules\n- JavaScript rendering support\n- Data export (JSON/CSV/Excel)\n- Rate limiting and politeness",
            devCat, author, "curl -sSL https://skill.store/install/web-scraper | bash",
            List.of("Web", "Data"), List.of("Claude Code", "Terminal"),
            List.of("Configure target URL", "Define extraction rules", "Run scraper", "Verify output format"),
            SecurityLevel.C);

        createSkill("Security Audit Skill",
            "security-audit-skill",
            "Automated security vulnerability scanning and reporting for your codebase",
            "### Security Audit Skill\n\nSecurity-first auditing tool:\n- OWASP Top 10 scanning\n- Dependency vulnerability check\n- SAST analysis\n- Compliance reporting",
            devCat, author, "curl -sSL https://skill.store/install/security-audit | bash",
            List.of("Security", "Web"), List.of("Claude Code", "GitHub Actions", "GitLab CI"),
            List.of("Initialize scan in project directory", "Select scan type (quick/full)", "Review vulnerability report", "Verify fix suggestions"),
            SecurityLevel.S);

        createSkill("UI Design Generator",
            "ui-design-generator",
            "Generate beautiful UI components and layouts from text descriptions",
            "### UI Design Generator\n\nCreate stunning UIs instantly:\n- Text-to-component generation\n- Responsive layout builder\n- Color palette generator\n- Accessibility checker",
            designCat, author, "curl -sSL https://skill.store/install/ui-generator | bash",
            List.of("AI", "Web"), List.of("Claude Code", "Figma", "VS Code"),
            List.of("Describe desired UI component", "Review generated design", "Customize colors and layout", "Export to project"),
            SecurityLevel.B);

        createSkill("Data Pipeline Manager",
            "data-pipeline-manager",
            "Build and monitor ETL pipelines with real-time data transformation",
            "### Data Pipeline Manager\n\nStreamline data workflows:\n- Visual pipeline builder\n- Real-time monitoring\n- Error handling and retry\n- Multi-source support (DB, API, Files)",
            devCat, author, "curl -sSL https://skill.store/install/data-pipeline | bash",
            List.of("Data"), List.of("Claude Code", "Terminal"),
            List.of("Define data sources and destinations", "Configure transformation rules", "Run pipeline test", "Monitor execution logs"),
            SecurityLevel.A);

        createSkill("Meeting Notes AI",
            "meeting-notes-ai",
            "Transcribe, summarize, and extract action items from meetings automatically",
            "### Meeting Notes AI\n\nNever miss a meeting detail:\n- Real-time transcription\n- Smart summarization\n- Action item extraction\n- Integration with Notion, Slack, Jira",
            officeCat, author, "curl -sSL https://skill.store/install/meeting-notes | bash",
            List.of("AI"), List.of("Claude Code", "Zoom", "Teams", "Meet"),
            List.of("Connect to meeting", "Start transcription", "End meeting", "Review auto-generated summary"),
            SecurityLevel.C);

        createSkill("Image Editor Skill",
            "image-editor-skill",
            "AI-powered image editing: background removal, enhancement, and style transfer",
            "### Image Editor Skill\n\nProfessional image editing:\n- Background removal\n- Image enhancement\n- Style transfer\n- Batch processing",
            designCat, author, "curl -sSL https://skill.store/install/image-editor | bash",
            List.of("AI"), List.of("Claude Code", "Photoshop", "Figma"),
            List.of("Upload image", "Select editing mode", "Apply changes", "Download result"),
            SecurityLevel.B);

        log.info("=== Seed data initialized: 1 admin, 1 author, 1 user, 4 categories, 4 tags, 8 skills ===");
    }

    private User createUser(String username, String email, String password, UserRole role) {
        return userRepository.save(User.builder()
            .username(username).email(email)
            .passwordHash(passwordEncoder.encode(password))
            .role(role).build());
    }

    private Category createCategory(String name, String slug, Category parent, int sortOrder) {
        return categoryRepository.save(Category.builder()
            .name(name).slug(slug).parent(parent).sortOrder(sortOrder).build());
    }

    private Tag createTag(String name) {
        return tagRepository.save(Tag.builder()
            .name(name).slug(name.toLowerCase().replaceAll("[^a-z0-9]+", "-")).build());
    }

    private void createSkill(String name, String slug, String shortDesc, String desc,
                              Category category, User author, String installCmd,
                              List<String> tags, List<String> platforms, List<String> features,
                              SecurityLevel securityLevel) {
        Skill skill = skillRepository.save(Skill.builder()
            .name(name).slug(slug).shortDescription(shortDesc).description(desc)
            .category(category).author(author).installCommand(installCmd).build());

        for (String t : tags) {
            Tag tag = tagRepository.findByName(t).orElse(null);
            if (tag != null) skillTagRepository.save(SkillTag.builder().skill(skill).tag(tag).build());
        }
        for (String p : platforms) {
            compatiblePlatformRepository.save(CompatiblePlatform.builder().skill(skill).platformName(p).build());
        }
        int order = 0;
        for (String f : features) {
            featureListRepository.save(FeatureList.builder().skill(skill).featureName(f).sortOrder(order++).build());
        }
        securityRatingRepository.save(SecurityRating.builder().skill(skill).level(securityLevel)
            .description("Security audit completed for v" + skill.getVersion()).build());
    }
}
