import api from './api';

interface Category {
  name: string;
  code: string;
  type: string;
  icon: string;
  color: string;
}

interface CategoryResponse {
  status: boolean;
  code: number;
  message: string;
  data: Category[];
}

export const categoryService = {
  async getCategories(type: string = 'EXPENSE'): Promise<CategoryResponse> {
    try {
      const response = await api.get<CategoryResponse>(`/category/?type=${type}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }
}; 