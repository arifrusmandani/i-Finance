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
  }
}; 