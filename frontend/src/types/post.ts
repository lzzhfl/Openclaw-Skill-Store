export interface PostVO {
  id: number;
  title: string;
  content: string;
  postType: string;
  authorName: string;
  authorAvatar: string;
  viewCount: number;
  replyCount: number;
  isPinned: boolean;
  createdAt: string;
}

export interface CommentVO {
  id: number;
  content: string;
  authorName: string;
  authorAvatar: string;
  parentId: number | null;
  createdAt: string;
  replies?: CommentVO[];
}
