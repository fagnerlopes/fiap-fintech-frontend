import { httpClient } from './httpClient';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/auth/login', credentials);
  },

  async register(data: RegisterRequest): Promise<User> {
    return httpClient.post<User>('/auth/registro', data);
  },
};

