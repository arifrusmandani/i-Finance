import { Card, CardContent } from './ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function OverviewSection() {
  const data = {
    totalBalance: 432568,
    totalPeriodChange: 245860,
    totalExpenses: 25.35,
    totalIncome: 22.56,
    lastMonthChange: 24478,
    changePercentage: 2.47
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance Card */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.totalBalance)}
            </span>
            <div className="flex items-center mt-2">
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">{data.changePercentage}%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Last month {formatCurrency(data.lastMonthChange)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Period Change Card */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Period Change</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.totalPeriodChange)}
            </span>
            <div className="flex items-center mt-2">
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">{data.changePercentage}%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Last month {formatCurrency(data.lastMonthChange)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Period Expenses Card */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Period Expenses</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.totalExpenses)}
            </span>
            <div className="flex items-center mt-2">
              <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500">{data.changePercentage}%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Last month {formatCurrency(data.lastMonthChange)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Period Income Card */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Period Income</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.totalIncome)}
            </span>
            <div className="flex items-center mt-2">
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">{data.changePercentage}%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Last month {formatCurrency(data.lastMonthChange)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
  