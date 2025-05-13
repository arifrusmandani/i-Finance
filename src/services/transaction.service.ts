import api from './api';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: 'EXPENSE' | 'INCOME';
  category_code: string;
  date: string;
  user_id: number;
  category_name: string;
  category_icon: string;
  created_at: string;
}

interface TransactionResponse {
  status: boolean;
  code: number;
  message: string;
  data: Transaction[];
  record_count: number;
}

export const transactionService = {
  async getRecentTransactions(offset: number = 0, limit: number = 5): Promise<TransactionResponse> {
    try {
      const response = await api.get<TransactionResponse>(`/transaction/?offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  async getAllTransactions(offset: number = 0, limit: number = 20): Promise<TransactionResponse> {
    try {
      const response = await api.get<TransactionResponse>(`/transaction/?offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }
}; 