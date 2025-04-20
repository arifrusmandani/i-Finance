import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { format } from 'date-fns';
import { 
  Utensils,
  Car, 
  Wallet,
  ShoppingBag,
  Zap
} from 'lucide-react';

interface Transaction {
  id: number;
  icon: React.ReactNode;
  category: string;
  description: string;
  amount: number;
  datetime: string;
  type: string;
}

const transactionData: Transaction[] = [
  {
    id: 1,
    icon: <Utensils className="w-4 h-4" />,
    category: 'Food & Drinks',
    description: 'Lunch with team at Burger King',
    amount: -125000,
    datetime: '2024-03-15T12:30:00',
    type: 'expense'
  },
  {
    id: 2,
    icon: <Car className="w-4 h-4" />,
    category: 'Transportation',
    description: 'Taxi fare to office',
    amount: -50000,
    datetime: '2024-03-15T10:15:00',
    type: 'expense'
  },
  {
    id: 3,
    icon: <Wallet className="w-4 h-4" />,
    category: 'Salary',
    description: 'Monthly salary payment',
    amount: 5000000,
    datetime: '2024-03-14T09:00:00',
    type: 'income'
  },
  {
    id: 4,
    icon: <ShoppingBag className="w-4 h-4" />,
    category: 'Shopping',
    description: 'New clothes from H&M',
    amount: -750000,
    datetime: '2024-03-14T15:45:00',
    type: 'expense'
  },
  {
    id: 5,
    icon: <Zap className="w-4 h-4" />,
    category: 'Utilities',
    description: 'Electricity bill payment',
    amount: -200000,
    datetime: '2024-03-13T14:20:00',
    type: 'expense'
  }
];

export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Datetime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionData.map((transaction) => (
                <Tooltip key={transaction.id}>
                  <TooltipTrigger asChild>
                    <TableRow 
                      className="cursor-help hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                            {transaction.icon}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {transaction.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right text-sm ${
                        transaction.type === 'expense' 
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        Rp {Math.abs(transaction.amount).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(transaction.datetime), 'dd MMM yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {transaction.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
} 