import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  email: string;
  name: string;
  phone: string;
  profile_picture: string;
  user_type: string;
}

interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: User;
  } | null;
  status: boolean;
  code: number;
}

interface UserResponse {
  message: string;
  data: User | null;
  status: boolean;
  code: number;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
      const response = await api.post<LoginResponse>('/user/login', formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>('/user/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },
}; 