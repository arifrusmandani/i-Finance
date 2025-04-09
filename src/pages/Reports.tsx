import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, DownloadIcon, FilterIcon } from 'lucide-react';
import * as Select from '@radix-ui/react-select';

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface CategoryReport {
  category: string;
  income: number;
  expense: number;
  balance: number;
}

// Dummy data for demonstration
const dummyData = {
  chartData: [
    { name: 'Jan', income: 7000000, expense: 4500000 },
    { name: 'Feb', income: 8500000, expense: 5200000 },
    { name: 'Mar', income: 7800000, expense: 4800000 },
    { name: 'Apr', income: 9200000, expense: 5500000 },
  ],
  categoryReport: [
    { category: 'Salary', income: 7000000, expense: 0, balance: 7000000 },
    { category: 'Investment', income: 2200000, expense: 0, balance: 2200000 },
    { category: 'Food & Beverage', income: 0, expense: 1500000, balance: -1500000 },
    { category: 'Transportation', income: 0, expense: 800000, balance: -800000 },
    { category: 'Housing', income: 0, expense: 2500000, balance: -2500000 },
  ],
};

export default function Reports() {
  const [period, setPeriod] = useState<PeriodType>('monthly');

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
              <Select.Root value={period} onValueChange={(value: PeriodType) => setPeriod(value)}>
                <Select.Trigger className="inline-flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white min-w-[150px]">
                  <Select.Value />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <Select.Viewport>
                      <Select.Item value="daily" className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <Select.ItemText>Daily</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="weekly" className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <Select.ItemText>Weekly</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="monthly" className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <Select.ItemText>Monthly</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="yearly" className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <Select.ItemText>Yearly</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <FilterIcon className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#22c55e" />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Report Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Income</th>
                    <th className="px-4 py-3 text-right">Expense</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dummyData.categoryReport.map((item, index) => (
                    <tr key={index} className="bg-white dark:bg-gray-900">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                        {item.income > 0 ? formatCurrency(item.income) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">
                        {item.expense > 0 ? formatCurrency(item.expense) : '-'}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        item.balance >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(item.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 