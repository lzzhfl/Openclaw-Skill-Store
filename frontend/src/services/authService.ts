import apiClient from './apiClient';
import type { UserVO } from '../types/user';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: UserVO;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data.data;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post('/api/auth/refresh');
    return response.data.data;
  },

  async getMe(): Promise<UserVO> {
    const response = await apiClient.get('/api/auth/me');
    return response.data.data;
  },
};
