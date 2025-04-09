import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '../lib/utils';
import { PlaneIcon, CameraIcon, CoffeeIcon } from 'lucide-react';

interface Transaction {
  id: number;
  icon: JSX.Element;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'outcome';
  date: string;
}

const recentTransactions: Transaction[] = [
  {
    id: 1,
    icon: <PlaneIcon className="w-4 h-4" />,
    title: 'Emirates',
    category: 'Transport',
    amount: 683.00,
    type: 'outcome',
    date: 'Yesterday'
  },
  {
    id: 2,
    icon: <CameraIcon className="w-4 h-4" />,
    title: 'Cinema',
    category: 'Other',
    amount: 17.20,
    type: 'outcome',
    date: 'Yesterday'
  },
  {
    id: 3,
    icon: <CoffeeIcon className="w-4 h-4" />,
    title: 'Starbucks',
    category: 'Food & Drink',
    amount: 14.99,
    type: 'outcome',
    date: '21.04.2023'
  }
];

export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentTransactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {transaction.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 