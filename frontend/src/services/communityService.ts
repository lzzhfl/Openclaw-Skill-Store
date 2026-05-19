import apiClient from './apiClient';
import type { PostVO, CommentVO } from '../types/post';
import type { PageResult } from '../types/api';

export const communityService = {
  async getPosts(
    type: string = 'all',
    page: number = 0,
    size: number = 10
  ): Promise<PageResult<PostVO>> {
    const response = await apiClient.get('/api/community/posts', {
      params: { type, page, size },
    });
    return response.data.data;
  },

  async getPost(id: number): Promise<PostVO> {
    const response = await apiClient.get(`/api/community/posts/${id}`);
    return response.data.data;
  },

  async createPost(data: {
    title: string;
    content: string;
    postType: string;
  }): Promise<PostVO> {
    const response = await apiClient.post('/api/community/posts', data);
    return response.data.data;
  },

  async getComments(postId: number): Promise<CommentVO[]> {
    const response = await apiClient.get(`/api/community/posts/${postId}/comments`);
    return response.data.data;
  },

  async createComment(
    postId: number,
    content: string,
    parentId?: number
  ): Promise<CommentVO> {
    const response = await apiClient.post(
      `/api/community/posts/${postId}/comments`,
      { content, parentId }
    );
    return response.data.data;
  },
};
