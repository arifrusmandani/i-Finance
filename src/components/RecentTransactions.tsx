import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '../lib/utils';
import { 
  Brush, 
  Receipt, 
  Car, 
  GraduationCap,
  Tv
} from 'lucide-react';

interface Transaction {
  id: number;
  icon: React.ReactNode;
  category: string;
  description: string;
  amount: number;
  date: string;
  time: string;
}

const transactionData: Transaction[] = [
  {
    id: 1,
    icon: <Brush className="w-4 h-4" />,
    category: 'Beauty',
    description: 'Grocery Items and Beverage soft drinks',
    amount: 32.20,
    date: '12.12.2023',
    time: '09:30 AM'
  },
  {
    id: 2,
    icon: <Receipt className="w-4 h-4" />,
    category: 'Bills & Fees',
    description: 'Grocery Items and Beverage soft drinks',
    amount: 32.20,
    date: '12.12.2023',
    time: '10:15 AM'
  },
  {
    id: 3,
    icon: <Car className="w-4 h-4" />,
    category: 'Car',
    description: 'Grocery Items and Beverage soft drinks',
    amount: 32.20,
    date: '12.12.2023',
    time: '11:45 AM'
  },
  {
    id: 4,
    icon: <GraduationCap className="w-4 h-4" />,
    category: 'Education',
    description: 'Grocery Items and Beverage soft drinks',
    amount: 32.20,
    date: '12.12.2023',
    time: '02:30 PM'
  },
  {
    id: 5,
    icon: <Tv className="w-4 h-4" />,
    category: 'Entertainment',
    description: 'Grocery Items and Beverage soft drinks',
    amount: 32.20,
    date: '12.12.2023',
    time: '04:15 PM'
  }
];

export default function RecentTransactions() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3">Date</th>
                <th scope="col" className="px-4 py-3">Description</th>
                <th scope="col" className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {transaction.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {transaction.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-gray-900 dark:text-white">
                        {transaction.date}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600 dark:text-red-400 font-medium">
                    -${formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 