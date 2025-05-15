import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, DownloadIcon, BrainCircuit } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { reportService } from '../services/report.service';


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

// Dummy AI analysis data
const dummyAnalysis = {
  current_month: `# Financial Analysis - Current Month

## 📊 Overview
Your financial health is showing positive trends this month with a **15% increase** in savings compared to last month.

## 💰 Key Insights
- **Income Growth**: +12% from previous month
- **Expense Reduction**: -8% in non-essential spending
- **Savings Rate**: 35% of total income

## 🎯 Recommendations
1. **Investment Opportunity**: Consider increasing your investment allocation by 5%
2. **Expense Optimization**: Review subscription services for potential savings
3. **Emergency Fund**: You're on track to reach your emergency fund goal in 2 months

## 📈 Trends
- Food & Beverage expenses decreased by 15%
- Transportation costs increased by 8%
- Housing expenses remain stable

## 🎯 Action Items
- Review investment portfolio allocation
- Set up automatic savings transfer
- Monitor subscription renewals`,

  '3_months': `# Financial Analysis - Last 3 Months

## 📊 Overview
Your financial performance over the last 3 months shows consistent growth with some areas for improvement.

## 💰 Key Insights
- **Average Monthly Savings**: 28% of income
- **Investment Growth**: +8% portfolio value
- **Debt Reduction**: 15% decrease in total debt

## 🎯 Recommendations
1. **Diversification**: Consider adding more diverse investment options
2. **Budget Review**: Implement stricter budget controls for entertainment expenses
3. **Income Streams**: Explore additional income opportunities

## 📈 Trends
- Consistent income growth
- Fluctuating utility expenses
- Increasing investment returns

## 🎯 Action Items
- Schedule quarterly investment review
- Update budget categories
- Research new investment opportunities`,

  '6_months': `# Financial Analysis - Last 6 Months

## 📊 Overview
Your financial journey over the past 6 months shows significant progress towards your long-term goals.

## 💰 Key Insights
- **Total Savings**: 32% of income
- **Investment Returns**: +12% overall
- **Debt Management**: 25% reduction in total debt

## 🎯 Recommendations
1. **Portfolio Rebalancing**: Consider adjusting asset allocation
2. **Tax Planning**: Review tax-efficient investment strategies
3. **Emergency Fund**: Increase emergency fund target

## 📈 Trends
- Steady income growth
- Decreasing discretionary spending
- Increasing investment contributions

## 🎯 Action Items
- Schedule semi-annual financial review
- Update financial goals
- Review insurance coverage`,

  '1_year': `# Financial Analysis - Last Year

## 📊 Overview
Your annual financial performance demonstrates strong growth and effective financial management.

## 💰 Key Insights
- **Annual Savings Rate**: 30% of income
- **Investment Growth**: +18% portfolio value
- **Debt Reduction**: 40% decrease in total debt

## 🎯 Recommendations
1. **Long-term Planning**: Review retirement goals
2. **Asset Allocation**: Consider rebalancing investment portfolio
3. **Tax Strategy**: Optimize tax-efficient investments

## 📈 Trends
- Consistent income growth
- Decreasing debt-to-income ratio
- Increasing net worth

## 🎯 Action Items
- Schedule annual financial review
- Update long-term financial goals
- Review estate planning`
};

export default function Reports() {
  const [categoryReport, setCategoryReport] = useState<CategoryReport[]>([]);
  const [chartData, setChartData] = useState<MonthlyChartData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

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

  // Calculate total balance
  const totalBalance = categoryReport.reduce((sum, item) => 
    sum + (item.type === 'INCOME' ? item.amount : -item.amount), 0
  );

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
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
              </div>

              {/* Year Selection */}
              <Select.Root 
                value={selectedYear?.toString()} 
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <Select.Trigger className="inline-flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white min-w-[120px]">
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
                      <Tooltip 
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Overview and Key Insights */}
                <div className="space-y-6">
                  {/* Overview Section */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                      <span>📊</span> Overview
                    </h2>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      Your financial health is showing positive trends this month with a <span className="font-semibold">15% increase</span> in savings compared to last month.
                    </p>
                  </div>

                  {/* Key Insights Section */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                      <span>💰</span> Key Insights
                    </h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span className="text-green-800 dark:text-green-200">
                          <span className="font-semibold">Income Growth:</span> +12% from previous month
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span className="text-green-800 dark:text-green-200">
                          <span className="font-semibold">Expense Reduction:</span> -8% in non-essential spending
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span className="text-green-800 dark:text-green-200">
                          <span className="font-semibold">Savings Rate:</span> 35% of total income
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column - Recommendations and Action Items */}
                <div className="space-y-6">
                  {/* Recommendations Section */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                      <span>🎯</span> Recommendations
                    </h2>
                    <ol className="space-y-3 list-decimal list-inside">
                      <li className="text-purple-800 dark:text-purple-200">
                        <span className="font-semibold">Investment Opportunity:</span> Consider increasing your investment allocation by 5%
                      </li>
                      <li className="text-purple-800 dark:text-purple-200">
                        <span className="font-semibold">Expense Optimization:</span> Review subscription services for potential savings
                      </li>
                      <li className="text-purple-800 dark:text-purple-200">
                        <span className="font-semibold">Emergency Fund:</span> You're on track to reach your emergency fund goal in 2 months
                      </li>
                    </ol>
                  </div>

                  {/* Action Items Section */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                      <span>📝</span> Action Items
                    </h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400">•</span>
                        <span className="text-amber-800 dark:text-amber-200">Review investment portfolio allocation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400">•</span>
                        <span className="text-amber-800 dark:text-amber-200">Set up automatic savings transfer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400">•</span>
                        <span className="text-amber-800 dark:text-amber-200">Monitor subscription renewals</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Trends Section - Full Width */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <span>📈</span> Trends
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-gray-800 dark:text-gray-200">
                      <span className="font-semibold text-red-600 dark:text-red-400">↓</span> Food & Beverage expenses decreased by 15%
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-gray-800 dark:text-gray-200">
                      <span className="font-semibold text-red-600 dark:text-red-400">↑</span> Transportation costs increased by 8%
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-gray-800 dark:text-gray-200">
                      <span className="font-semibold text-gray-600 dark:text-gray-400">→</span> Housing expenses remain stable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 