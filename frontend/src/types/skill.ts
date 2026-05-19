export interface AuthorVO {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface FeatureVO {
  name: string;
  expectedBehavior: string;
}

export interface SkillVO {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  version: string;
  securityLevel: string;
  downloadsCount: number;
  ratingAvg: number;
  ratingCount: number;
  categoryName: string;
  authorName: string;
  tags: string[];
  platforms: string[];
  createdAt: string;
}

export interface SkillDetailVO extends SkillVO {
  description: string;
  coverUrl: string;
  installCommand: string;
  tutorial: string;
  securityDescription: string;
  categorySlug: string;
  author: AuthorVO;
  features: FeatureVO[];
  updatedAt: string;
}
