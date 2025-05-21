import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area,
  AreaChart
} from 'recharts';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { ChevronRight } from 'lucide-react';
import GreetingCard from '../components/GreetingCard';
import OverviewSection from '../components/OverviewSection';
import RecentTransactions from '../components/RecentTransactions';
import { formatCurrency } from '../lib/utils';
import { useState, useEffect } from 'react';
import { categoryService } from '../services/category.service';
import { reportService, MostExpenseCategory, IncomeCategory, ExpenseCategory } from '../services/report.service';
import { FormattedInput } from '../components/ui/formatted-input';
import { transactionService } from '../services/transaction.service';
import { toast } from 'sonner';
import type { TooltipProps } from 'recharts';

// Dummy data for charts
const cashflowData = [
  { day: 'Sun', income: 1000, expense: 700 },
  { day: 'Mon', income: 800, expense: 400 },
  { day: 'Tue', income: 1200, expense: 800 },
  { day: 'Wed', income: 600, expense: 400 },
  { day: 'Thu', income: 1400, expense: 900 },
  { day: 'Fri', income: 1100, expense: 700 },
  { day: 'Sat', income: 1300, expense: 800 }
];

const periodOptions = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 12 Months', value: '12m' }
];

interface Category {
  label: string;
  value: string;
  icon: string;
}

interface ApiError {
  message: string;
  code?: number;
  status?: boolean;
}

interface CategoryPieData {
  category_name: string;
  amount: number;
  color: string;
  index: number;
  type: string;
}

// Custom simple tooltip for pie charts
function SimplePieTooltip({ active, payload }: TooltipProps<any, number>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CategoryPieData;
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{data.category_name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(data.amount)}</p>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const [activeExpense, setActiveExpense] = useState<MostExpenseCategory | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mostExpensesData, setMostExpensesData] = useState<MostExpenseCategory[]>([]);
  const [isLoadingMostExpenses, setIsLoadingMostExpenses] = useState(true);
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([]);
  const [isLoadingIncomeCategories, setIsLoadingIncomeCategories] = useState(true);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [isLoadingExpenseCategories, setIsLoadingExpenseCategories] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshRecentTransactions, setRefreshRecentTransactions] = useState(0);

  useEffect(() => {
    const fetchMostExpenses = async () => {
      try {
        setIsLoadingMostExpenses(true);
        const response = await reportService.getMostExpenseCategory();
        if (response.status && response.data) {
          setMostExpensesData(response.data);
          if (response.data.length > 0) {
            setActiveExpense(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch most expenses:', error);
      } finally {
        setIsLoadingMostExpenses(false);
      }
    };

    fetchMostExpenses();
  }, []);

  useEffect(() => {
    const fetchIncomeCategories = async () => {
      try {
        setIsLoadingIncomeCategories(true);
        const response = await reportService.getIncomeCategories();
        if (response.status && response.data) {
          setIncomeCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch income categories:', error);
        toast.error('Failed to load income categories');
      } finally {
        setIsLoadingIncomeCategories(false);
      }
    };

    fetchIncomeCategories();
  }, []);

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      try {
        setIsLoadingExpenseCategories(true);
        const response = await reportService.getExpenseCategories();
        if (response.status && response.data) {
          setExpenseCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch expense categories:', error);
        toast.error('Failed to load expense categories');
      } finally {
        setIsLoadingExpenseCategories(false);
      }
    };

    fetchExpenseCategories();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await categoryService.getCategories();
        if (response.status && response.data) {
          const formattedCategories = response.data.map(cat => ({
            label: cat.name,
            value: cat.code,
            icon: cat.icon
          }));
          setCategories(formattedCategories);
          if (formattedCategories.length > 0) {
            setSelectedCategory(formattedCategories[0].value);
          }
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error('Failed to fetch categories:', apiError.message || 'Unknown error occurred');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePieEnter = (_: unknown, index: number) => {
    setHoveredIndex(index);
    setActiveExpense(mostExpensesData[index]);
  };

  const handlePieLeave = () => {
    setHoveredIndex(null);
  };

  const handleQuickTransaction = async () => {
    if (!selectedCategory || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await transactionService.createTransaction({
        amount: amount,
        type: 'EXPENSE',
        category_code: selectedCategory,
        date: new Date().toISOString().split('T')[0],
      });

      if (response.status) {
        toast.success('Transaction added successfully', {
          description: 'Your transaction has been recorded',
          duration: 3000,
        });

        // Reset form
        setAmount(0);
        setSelectedCategory(categories[0]?.value || '');

        // Trigger refresh for RecentTransactions
        setRefreshRecentTransactions(prev => prev + 1);
      } else {
        toast.error('Failed to add transaction', {
          description: response.message || 'Please try again later',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      toast.error('Failed to add transaction', {
        description: error instanceof Error ? error.message : 'Please try again later',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalIncomeAmount = incomeCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalExpenseAmount = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Main Content (wider) */}
          <div className="lg:w-2/3 space-y-6">
            <GreetingCard />
            <OverviewSection />
            {/* Cashflow Chart */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    Cashflow
                  </CardTitle>
                </div>
                <Select defaultValue="7d">
                  <SelectTrigger className="w-[140px] border-gray-200 dark:border-gray-700">
                    Last 7 Days
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Balance
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Rp 100.000.000
                    </h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Expense</span>
                    </div>
                  </div>
                </div>
                <div className="h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={cashflowData} 
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888888', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888888', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [`$${value}`, '']}
                        labelStyle={{ color: '#888888' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#4ade80"
                        strokeWidth={2}
                        fill="url(#incomeGradient)"
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        fill="url(#expenseGradient)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Outcome Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Outcome categories:</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(totalExpenseAmount)} in {currentMonth}
                  </p>
                </CardHeader>
                <CardContent>
                  {isLoadingExpenseCategories ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : expenseCategories.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No expense data available
                    </div>
                  ) : (
                    <>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expenseCategories.map((cat, index) => ({ ...cat, index, type: 'EXPENSE' }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="amount"
                            >
                              {expenseCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<SimplePieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 mt-4">
                        {expenseCategories.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{item.category_name}</span>
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Income Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Income categories:</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(totalIncomeAmount)} in {currentMonth}
                  </p>
                </CardHeader>
                <CardContent>
                  {isLoadingIncomeCategories ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : incomeCategories.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No income data available
                    </div>
                  ) : (
                    <>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={incomeCategories.map((cat, index) => ({ ...cat, index, type: 'INCOME' }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="amount"
                            >
                              {incomeCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<SimplePieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 mt-4">
                        {incomeCategories.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{item.category_name}</span>
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Right Column - Sidebar (narrower) */}
          <div className="lg:w-1/3 space-y-6">
            {/* Most Expenses Section */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Most expenses</CardTitle>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                  Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </CardHeader>
              <CardContent>
                {isLoadingMostExpenses ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : mostExpensesData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                    No expense data available
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative w-[200px] h-[200px] mx-auto mb-4">
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className={`text-center transform transition-all duration-200 ${
                          hoveredIndex !== null ? 'scale-110' : 'scale-100'
                        }`}>
                          <div className="text-xl font-bold text-gray-900 dark:text-white transition-all duration-200">
                            {activeExpense?.percentage.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 transition-all duration-200">
                            {activeExpense?.category_code}
                          </div>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mostExpensesData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="amount"
                            onMouseEnter={handlePieEnter}
                            onMouseLeave={handlePieLeave}
                            onClick={(_, index) => handlePieEnter(null, index)}
                          >
                            {mostExpensesData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color}
                                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.5}
                                className="cursor-pointer transition-all duration-200"
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {data.category_name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatCurrency(data.amount)}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {mostExpensesData.map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between cursor-pointer rounded-lg transition-all duration-200 ${
                            hoveredIndex === index 
                              ? 'bg-gray-50 dark:bg-gray-700 scale-105' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          onMouseEnter={() => handlePieEnter(null, index)}
                          onMouseLeave={handlePieLeave}
                          onClick={() => handlePieEnter(null, index)}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full transition-transform duration-200" 
                              style={{ 
                                backgroundColor: item.color,
                                transform: hoveredIndex === index ? 'scale(1.5)' : 'scale(1)'
                              }} 
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item.category_name}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Transaction Section */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-base font-medium">Quick Transaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                  disabled={isLoadingCategories || isSubmitting}
                >
                  <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    {isLoadingCategories ? (
                      <div className="flex items-center gap-2">
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{categories.find(cat => cat.value === selectedCategory)?.icon}</span>
                        <span>{categories.find(cat => cat.value === selectedCategory)?.label}</span>
                      </div>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormattedInput
                  value={amount}
                  onChange={setAmount}
                  placeholder="Amount"
                  prefix="Rp"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  disabled={isSubmitting}
                />

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleQuickTransaction}
                  disabled={isSubmitting || !selectedCategory || !amount}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Add'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Transactions moved to sidebar */}
            <RecentTransactions key={refreshRecentTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
}