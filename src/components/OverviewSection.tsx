import { Card, CardContent } from './ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function OverviewSection() {
  const data = {
    currentIncome: 729,
    totalBalance: 51213,
    currentExpense: 372
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Overview:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current month:</p>
            <div className="flex items-center gap-2">
              <ArrowUpIcon className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                +{formatCurrency(data.currentIncome)}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Balance:</p>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.totalBalance)}
            </span>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current month:</p>
            <div className="flex items-center gap-2">
              <ArrowDownIcon className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                -{formatCurrency(data.currentExpense)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
  