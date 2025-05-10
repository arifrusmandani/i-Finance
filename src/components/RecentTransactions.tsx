import React, { useEffect, useState } from 'react';
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
import { transactionService } from '../services/transaction.service';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: 'EXPENSE' | 'INCOME';
  category_code: string;
  date: string;
  user_id: number;
  category_name: string;
  category_icon: string;
  created_at: string;
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionService.getRecentTransactions();
        if (response.status && response.data) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <Tooltip key={transaction.id}>
                    <TooltipTrigger asChild>
                      <TableRow 
                        className="cursor-help hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                              {transaction.category_icon}
                            </div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {transaction.category_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className={`text-right text-sm ${
                          transaction.type === 'EXPENSE' 
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {transaction.type === 'EXPENSE' ? '-' : '+'}
                          Rp {Math.abs(transaction.amount).toLocaleString('id-ID')}
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(transaction.date), 'dd MMM yyyy')}
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
                ))
              )}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
} 