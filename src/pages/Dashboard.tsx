import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
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