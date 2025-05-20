import api from './api';

export interface Transaction {
  id: number;
  amount: number;
  description: string | null;
  type: 'EXPENSE' | 'INCOME';
  category_code: string;
  date: string;
  user_id: number;
  category_name: string;
  category_icon: string;
  created_at: string;
}

export interface TransactionResponse {
  status: boolean;
  code: number;
  message: string;
  data: Transaction[] | null;
  record_count?: number;
}

export interface TransactionSummary {
  total_income: number;
  total_expense: number;
  total_balance: number;
}

export interface TransactionSummaryResponse {
  status: boolean;
  code: number;
  message: string;
  data: TransactionSummary;
}

export interface CreateTransactionRequest {
  amount: number;
  description?: string;
  type: 'EXPENSE' | 'INCOME';
  category_code: string;
  date: string;
}

export interface ErrorResponse {
  status: boolean;
  code: number;
  message: string;
  data: null;
}

interface ApiError {
  response?: {
    data: ErrorResponse;
  };
}

export const transactionService = {
  getRecentTransactions: async (offset: number = 0, limit: number = 5): Promise<TransactionResponse> => {
    try {
      const response = await api.get(`/transaction/?offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to fetch recent transactions:', error);
      const apiError = error as ApiError;
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
      throw error;
    }
  },

  getAllTransactions: async (offset: number = 0, limit: number = 10): Promise<TransactionResponse> => {
    try {
      const response = await api.get(`/transaction/?offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to fetch all transactions:', error);
      const apiError = error as ApiError;
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
      throw error;
    }
  },

  getTransactionSummary: async (): Promise<TransactionSummaryResponse> => {
    try {
      const response = await api.get('/transaction/user/summary');
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to fetch transaction summary:', error);
      const apiError = error as ApiError;
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
      throw error;
    }
  },

  createTransaction: async (data: CreateTransactionRequest): Promise<TransactionResponse> => {
    try {
      // Format request body as JSON
      const requestData = {
        amount: Number(data.amount),
        type: data.type,
        category_code: data.category_code,
        date: data.date,
        ...(data.description && { description: data.description }),
      };

      const response = await api.post('/transaction/', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to create transaction:', error);
      const apiError = error as ApiError;
      if (apiError.response?.data) {
        const errorData = apiError.response.data;
        throw new Error(errorData.message || 'Failed to create transaction');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  bulkUploadTransactions: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/transaction/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
      throw error;
    }
  },
}; 