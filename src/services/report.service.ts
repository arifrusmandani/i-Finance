import api from './api';
import { AxiosError } from 'axios';

interface CategoryReport {
  category: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
}

interface ReportResponse {
  status: boolean;
  code: number;
  message: string;
  data: CategoryReport[];
  record_count: number;
}

interface MonthlyChartData {
  name: string;
  income: number;
  expense: number;
}

interface MonthlyChartResponse {
  status: boolean;
  code: number;
  message: string;
  data: MonthlyChartData[];
}

export interface DashboardSummaryItem {
  label: string;
  value: number;
  percent: number;
  last_month: number;
}

export interface DashboardSummaryResponse {
  status: boolean;
  code: number;
  message: string;
  data: DashboardSummaryItem[];
}

export interface MostExpenseCategory {
  category_code: string;
  category_name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface IncomeCategory {
  category_code: string;
  category_name: string;
  amount: number;
  color: string;
}

export interface IncomeCategoriesResponse {
  status: boolean;
  code: number;
  message: string;
  data: IncomeCategory[];
}

export interface MostExpenseResponse {
  status: boolean;
  code: number;
  message: string;
  data: MostExpenseCategory[];
}

export interface ExpenseCategory {
  category_code: string;
  category_name: string;
  amount: number;
  color: string;
}

export interface ExpenseCategoriesResponse {
  status: boolean;
  code: number;
  message: string;
  data: ExpenseCategory[];
}

export interface AnalysisResult {
  ringkasan_umum: {
    bulan: string[];
    total_pemasukan: number[];
    total_pengeluaran: number[];
    arus_kas_bersih: number[];
    rata_rata: {
      total_pemasukan: number;
      total_pengeluaran: number;
      arus_kas_bersih: number;
    };
    catatan: string;
  };
  analisis_pemasukan: {
    sumber: {
      utama: string;
      tambahan: string;
    };
    stabilitas: string;
    fluktuasi: string;
  };
  analisis_pengeluaran: {
    kategori: {
      wajib: Array<{
        category_code: string;
        description: string;
      }>;
      semi_variabel: Array<{
        category_code: string;
        description: string;
      }>;
      tidak_tetap: Array<{
        category_code: string;
        description: string;
      }>;
    };
    tren: string;
  };
  observasi_kunci: {
    kesehatan_finansial: string;
    kekuatan: string;
    kelemahan: string;
  };
  rekomendasi: {
    alokasi_surplus: {
      dana_darurat: string;
      investasi: string;
    };
    anggaran_review: {
      anggaran: string;
      review: string;
    };
  };
}

export interface AnalysisResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    analysis_type: string;
    input_data: string;
    result: AnalysisResult;
    created_at: string;
  }
}

export interface ApiError {
  status: boolean;
  code: number;
  message: string;
}

export const reportService = {
  async getCategoryReport(): Promise<ReportResponse> {
    try {
      const response = await api.get<ReportResponse>('/report/category');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
  },

  async getMonthlyChartData(year?: number): Promise<MonthlyChartResponse> {
    try {
      const url = year ? `/report/monthly?year=${year}` : '/report/monthly';
      const response = await api.get<MonthlyChartResponse>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
  },

  getDashboardSummary: async (): Promise<DashboardSummaryResponse> => {
    try {
      const response = await api.get('/report/dashboard-summary');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
      throw error;
    }
  },

  getMostExpenseCategory: async (): Promise<MostExpenseResponse> => {
    try {
      const response = await api.get('/report/most-expense-category');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch most expense category:', error);
      throw error;
    }
  },

  getIncomeCategories: async (): Promise<IncomeCategoriesResponse> => {
    try {
      const response = await api.get('/report/income-categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch income categories:', error);
      throw error;
    }
  },

  getExpenseCategories: async (): Promise<ExpenseCategoriesResponse> => {
    try {
      const response = await api.get('/report/expense-categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch expense categories:', error);
      throw error;
    }
  },

  getLatestAnalysis: async (): Promise<AnalysisResponse> => {
    try {
      const response = await api.get('/ai/latest-analysis');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
  },

  analyzeFinancial: async (): Promise<AnalysisResponse> => {
    try {
      const response = await api.get('/ai/analyze-financial');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
  },
}; 