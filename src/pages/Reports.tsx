import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, DownloadIcon, BrainCircuit, X } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Tooltip from '@radix-ui/react-tooltip';
import { reportService, AnalysisResponse } from '../services/report.service';

interface CategoryReport {
  category: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
}

interface MonthlyChartData {
  name: string;
  income: number;
  expense: number;
}

export default function Reports() {
  const [categoryReport, setCategoryReport] = useState<CategoryReport[]>([]);
  const [chartData, setChartData] = useState<MonthlyChartData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse['data'] | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(true);

  // Generate years for selection (current year and 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchCategoryReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await reportService.getCategoryReport();
        if (response.status && response.data) {
          setCategoryReport(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch category report:', error);
        setError('Failed to load category report. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryReport();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsChartLoading(true);
        setChartError(null);
        const response = await reportService.getMonthlyChartData(selectedYear);
        if (response.status && response.data) {
          setChartData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setChartError('Failed to load chart data. Please try again later.');
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchChartData();
  }, [selectedYear]);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setIsAnalysisLoading(true);
        setAnalysisError(null);
        const response = await reportService.getLatestAnalysis();
        if (response.status && response.data) {
          setAnalysisData(response.data);
        }
      } catch (error: any) {
        console.error('Failed to fetch analysis data:', error);
        // Only set error if it's not a 404 (not found) error
        if (error.code !== 404) {
          setAnalysisError('Failed to load financial analysis. Please try again later.');
        }
      } finally {
        setIsAnalysisLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  // Calculate total balance
  const totalBalance = categoryReport.reduce((sum, item) => 
    sum + (item.type === 'INCOME' ? item.amount : -item.amount), 0
  );

  const handleAnalyze = async () => {
    try {
      setIsAnalysisLoading(true);
      setAnalysisError(null);
      await reportService.analyzeFinancial();
      // After successful analysis, fetch the latest analysis data
      const response = await reportService.getLatestAnalysis();
      if (response.status && response.data) {
        setAnalysisData(response.data);
      }
    } catch (error) {
      console.error('Failed to analyze financial data:', error);
      setAnalysisError('Failed to analyze financial data. Please try again later.');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const isAnalyzeButtonDisabled = () => {
    if (!analysisData?.created_at) return false;
    
    const lastAnalysisDate = new Date(analysisData.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastAnalysisDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays < 7;
  };

  const getAnalyzeButtonTooltip = () => {
    if (!analysisData?.created_at) return '';
    
    const lastAnalysisDate = new Date(analysisData.created_at);
    const nextAvailableDate = new Date(lastAnalysisDate);
    nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);
    
    return (
      <div className="flex flex-col gap-1">
        <span className="font-medium">Next Analysis Available</span>
        <span className="text-sm text-gray-400">
          {nextAvailableDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Financial Reports</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and analyze your financial data</p>
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>

        {/* Period Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 w-fit">
              <div className="flex items-center gap-2 min-w-[80px]">
                <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Period:</span>
              </div>

              {/* Year Selection */}
              <Select.Root 
                value={selectedYear?.toString()} 
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <Select.Trigger className="inline-flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white w-[140px]">
                  <Select.Value placeholder="Select Year" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <Select.Viewport>
                      {years.map((year) => (
                        <Select.Item 
                          key={year} 
                          value={year.toString()} 
                          className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Select.ItemText>{year}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </CardContent>
        </Card>

        {/* Chart and Category Report Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-900 dark:text-white">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {isChartLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : chartError ? (
                  <div className="flex items-center justify-center h-full text-red-500 dark:text-red-400">
                    {chartError}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#374151', opacity: 0.2 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => {
                          if (value >= 1000000) {
                            return `${(value / 1000000).toFixed(1)}M`;
                          } else if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}K`;
                          }
                          return value.toString();
                        }}
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#374151', opacity: 0.2 }}
                      />
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'rgb(31 41 55)',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: 'white',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        wrapperStyle={{
                          paddingBottom: '20px'
                        }}
                      />
                      <Bar 
                        dataKey="income" 
                        name="Income" 
                        fill="#22c55e" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar 
                        dataKey="expense" 
                        name="Expense" 
                        fill="#ef4444" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Report Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Category Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500 dark:text-red-400">
                    {error}
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {categoryReport.map((item, index) => (
                        <tr 
                          key={index} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                item.type === 'INCOME' 
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                                  : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {item.type === 'INCOME' ? '↑' : '↓'}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white capitalize">
                                {item.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.type === 'INCOME'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`font-medium ${
                              item.type === 'INCOME'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {item.type === 'INCOME' ? '+' : '-'} {formatCurrency(item.amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          Total
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Balance</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${
                            totalBalance >= 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {totalBalance >= 0 ? '+' : '-'} {formatCurrency(Math.abs(totalBalance))}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Analysis Section */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-lg text-gray-900 dark:text-white">AI Financial Analysis</CardTitle>
              </div>
              <div className="flex items-center gap-4">
                {!isAnalysisLoading && !analysisError && analysisData && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Generated: {new Date(analysisData.created_at).toLocaleDateString('id-ID', { 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button 
                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
                        onClick={handleAnalyze}
                        disabled={isAnalysisLoading || isAnalyzeButtonDisabled()}
                      >
                        <BrainCircuit className="w-4 h-4 mr-2 group-hover:animate-pulse text-white/90" />
                        <span className="font-medium tracking-wide">
                          {isAnalysisLoading ? 'Analyzing...' : 'Analyze'}
                        </span>
                      </button>
                    </Tooltip.Trigger>
                    {isAnalyzeButtonDisabled() && (
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                          sideOffset={5}
                        >
                          {getAnalyzeButtonTooltip()}
                          <Tooltip.Arrow className="fill-gray-900" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    )}
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isAnalysisLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : analysisError ? (
              <div className="text-center py-8 text-red-500 dark:text-red-400">
                {analysisError}
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {/* AI Warning/Disclaimer Section */}
                {showWarning && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => setShowWarning(false)}
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors"
                      aria-label="Close warning"
                    >
                      <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </button>
                    <div className="flex items-start gap-3 pr-6">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                          Powered by Gemini AI
                        </h3>
                        <div className="text-xs text-amber-700 dark:text-amber-300 space-y-2">
                          <p>
                            This financial analysis is generated using Google's Gemini AI technology. Please note the following:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>The analysis is based on your transaction data and should be used as a reference only</li>
                            <li>Financial decisions should not be made solely based on AI-generated insights</li>
                            <li>Consult with financial advisors for professional advice on important financial matters</li>
                            <li>The analysis is limited to once per week to ensure data accuracy and system stability</li>
                            <li>Results may vary based on the quality and completeness of your transaction data</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!analysisData ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 max-w-2xl mx-auto">
                      <div className="flex flex-col items-center gap-4">
                        <BrainCircuit className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            No Analysis Data Available
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            You haven't generated any financial analysis yet. Click the Analyze button above to get started with your first AI-powered financial analysis.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Overview Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
                      <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                        <span>📊</span> Ringkasan Umum
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-blue-200 dark:border-blue-800">
                              <th className="px-4 py-2 text-left text-sm font-medium text-blue-700 dark:text-blue-300">Bulan</th>
                              <th className="px-4 py-2 text-right text-sm font-medium text-blue-700 dark:text-blue-300">Total Pemasukan</th>
                              <th className="px-4 py-2 text-right text-sm font-medium text-blue-700 dark:text-blue-300">Total Pengeluaran</th>
                              <th className="px-4 py-2 text-right text-sm font-medium text-blue-700 dark:text-blue-300">Arus Kas Bersih</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analysisData.result.ringkasan_umum.bulan.map((bulan, index) => (
                              <tr key={bulan} className="border-b border-blue-100 dark:border-blue-800/50">
                                <td className="px-4 py-2 text-sm text-blue-900 dark:text-blue-100">
                                  {new Date(bulan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </td>
                                <td className="px-4 py-2 text-sm text-right text-green-600 dark:text-green-400">
                                  +{formatCurrency(analysisData.result.ringkasan_umum.total_pemasukan[index])}
                                </td>
                                <td className="px-4 py-2 text-sm text-right text-red-600 dark:text-red-400">
                                  -{formatCurrency(analysisData.result.ringkasan_umum.total_pengeluaran[index])}
                                </td>
                                <td className="px-4 py-2 text-sm text-right text-green-600 dark:text-green-400">
                                  +{formatCurrency(analysisData.result.ringkasan_umum.arus_kas_bersih[index])}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-blue-50 dark:bg-blue-900/30">
                              <td className="px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100">Rata-rata</td>
                              <td className="px-4 py-2 text-sm text-right font-medium text-green-600 dark:text-green-400">
                                +{formatCurrency(analysisData.result.ringkasan_umum.rata_rata.total_pemasukan)}
                              </td>
                              <td className="px-4 py-2 text-sm text-right font-medium text-red-600 dark:text-red-400">
                                -{formatCurrency(analysisData.result.ringkasan_umum.rata_rata.total_pengeluaran)}
                              </td>
                              <td className="px-4 py-2 text-sm text-right font-medium text-green-600 dark:text-green-400">
                                +{formatCurrency(analysisData.result.ringkasan_umum.rata_rata.arus_kas_bersih)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4 text-sm text-blue-800 dark:text-blue-200">
                        {analysisData.result.ringkasan_umum.catatan}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Income Analysis */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                          <span>💰</span> Analisis Pemasukan
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Sumber Pemasukan</h3>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400">•</span>
                                <span className="text-sm text-green-800 dark:text-green-200">
                                  <span className="font-medium">Utama/Rutin:</span> {analysisData.result.analisis_pemasukan.sumber.utama}
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400">•</span>
                                <span className="text-sm text-green-800 dark:text-green-200">
                                  <span className="font-medium">Tambahan/Tidak Tetap:</span> {analysisData.result.analisis_pemasukan.sumber.tambahan}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Stabilitas & Fluktuasi</h3>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400">•</span>
                                <span className="text-sm text-green-800 dark:text-green-200">
                                  {analysisData.result.analisis_pemasukan.stabilitas}
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400">•</span>
                                <span className="text-sm text-green-800 dark:text-green-200">
                                  {analysisData.result.analisis_pemasukan.fluktuasi}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Expense Analysis */}
                      <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                          <span>📉</span> Analisis Pengeluaran
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Kategori Pengeluaran</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white/50 dark:bg-red-900/30 rounded-lg p-3">
                                <h4 className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Tetap/Wajib</h4>
                                <ul className="space-y-1">
                                  {analysisData.result.analisis_pengeluaran.kategori.wajib.map((item, index) => (
                                    <li key={index} className="text-sm text-red-800 dark:text-red-200">{item.description}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-white/50 dark:bg-red-900/30 rounded-lg p-3">
                                <h4 className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Semi-Variabel</h4>
                                <ul className="space-y-1">
                                  {analysisData.result.analisis_pengeluaran.kategori.semi_variabel.map((item, index) => (
                                    <li key={index} className="text-sm text-red-800 dark:text-red-200">{item.description}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-white/50 dark:bg-red-900/30 rounded-lg p-3 col-span-2">
                                <h4 className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Tidak Tetap</h4>
                                <ul className="space-y-1">
                                  {analysisData.result.analisis_pengeluaran.kategori.tidak_tetap.map((item, index) => (
                                    <li key={index} className="text-sm text-red-800 dark:text-red-200">{item.description}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Tren Pengeluaran</h3>
                            <p className="text-sm text-red-800 dark:text-red-200">
                              {analysisData.result.analisis_pengeluaran.tren}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Observations & Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Key Observations */}
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                          <span>🔍</span> Observasi Kunci
                        </h2>
                        <div className="space-y-4">
                          <div className="bg-white/50 dark:bg-purple-900/30 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">Kesehatan Finansial</h3>
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                              {analysisData.result.observasi_kunci.kesehatan_finansial}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/50 dark:bg-purple-900/30 rounded-lg p-3">
                              <h4 className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Kekuatan</h4>
                              <p className="text-sm text-purple-800 dark:text-purple-200">{analysisData.result.observasi_kunci.kekuatan}</p>
                            </div>
                            <div className="bg-white/50 dark:bg-purple-900/30 rounded-lg p-3">
                              <h4 className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Kelemahan</h4>
                              <p className="text-sm text-purple-800 dark:text-purple-200">{analysisData.result.observasi_kunci.kelemahan}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                          <span>🎯</span> Rekomendasi
                        </h2>
                        <div className="space-y-4">
                          <div className="bg-white/50 dark:bg-amber-900/30 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Alokasi Surplus</h3>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-amber-600 dark:text-amber-400">•</span>
                                <span className="text-sm text-amber-800 dark:text-amber-200">
                                  <span className="font-medium">Dana Darurat:</span> {analysisData.result.rekomendasi.alokasi_surplus.dana_darurat}
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-600 dark:text-amber-400">•</span>
                                <span className="text-sm text-amber-800 dark:text-amber-200">
                                  <span className="font-medium">Investasi:</span> {analysisData.result.rekomendasi.alokasi_surplus.investasi}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-white/50 dark:bg-amber-900/30 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Anggaran & Review</h3>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-amber-600 dark:text-amber-400">•</span>
                                <span className="text-sm text-amber-800 dark:text-amber-200">
                                  <span className="font-medium">Anggaran:</span> {analysisData.result.rekomendasi.anggaran_review.anggaran}
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-600 dark:text-amber-400">•</span>
                                <span className="text-sm text-amber-800 dark:text-amber-200">
                                  <span className="font-medium">Review:</span> {analysisData.result.rekomendasi.anggaran_review.review}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 