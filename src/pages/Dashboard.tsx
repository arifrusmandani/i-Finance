import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area,
  AreaChart
} from 'recharts';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../components/ui/select';
import GreetingCard from '../components/GreetingCard';
import OverviewSection from '../components/OverviewSection';
import FastTransaction from '../components/FastTransaction';
import RecentTransactions from '../components/RecentTransactions';
import { formatCurrency } from '../lib/utils';

// Dummy data for charts
const outcomeData = [
  { name: 'Investment', value: 2313, color: '#4ade80' },
  { name: 'Transport', value: 1281, color: '#fbbf24' },
  { name: 'Food', value: 629, color: '#60a5fa' },
  { name: 'Other', value: 501, color: '#93c5fd' }
];

const incomeData = [
  { name: 'Dividends', value: 3103, color: '#fbbf24' },
  { name: 'Salary', value: 2268, color: '#60a5fa' },
  { name: 'Transactions', value: 1738, color: '#4ade80' },
  { name: 'Other', value: 911, color: '#c084fc' }
];

const balanceHistory = [
  { name: 'Dec', value: 15 },
  { name: 'Jan', value: 35 },
  { name: 'Feb', value: 25 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 30 },
  { name: 'May', value: 50 }
];

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

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 space-y-6">
        <GreetingCard />
        <OverviewSection />
        <FastTransaction />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Outcome Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outcome categories:</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                4,724 USD in March
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={outcomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {outcomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {outcomeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Income Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income categories:</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                7,250 USD in March
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {incomeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />

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
                  $12,000
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
            <div className="h-[300px]">
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

        {/* Balance History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Balance history:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceHistory}>
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ fill: '#4f46e5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}