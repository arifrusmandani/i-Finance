import api from './api';

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
  color: string;
  percentage: number;
}

export interface MostExpenseResponse {
  status: boolean;
  code: number;
  message: string;
  data: MostExpenseCategory[];
}

export const reportService = {
  async getCategoryReport(): Promise<ReportResponse> {
    try {
      const response = await api.get<ReportResponse>('/report/category');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  async getMonthlyChartData(year?: number): Promise<MonthlyChartResponse> {
    try {
      const url = year ? `/report/monthly?year=${year}` : '/report/monthly';
      const response = await api.get<MonthlyChartResponse>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
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
}; 