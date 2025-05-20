// src/pages/Transactions.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowDownIcon, ArrowUpIcon, FilterIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { transactionService, Transaction as ServiceTransaction, TransactionSummary } from '../services/transaction.service';
import { categoryService } from '../services/category.service';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { toast } from 'sonner';
import { FormattedInput } from '../components/ui/formatted-input';

interface TransactionForm {
  amount: string;
  description: string;
  type: 'EXPENSE' | 'INCOME';
  category_code: string;
  date: string;
}

interface Category {
  code: string;
  name: string;
  icon: string;
  type: 'EXPENSE' | 'INCOME';
}

interface ApiCategory {
  code: string;
  name: string;
  icon: string;
  type: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<ServiceTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [summary, setSummary] = useState<TransactionSummary>({
    total_income: 0,
    total_expense: 0,
    total_balance: 0,
  });
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [formData, setFormData] = useState<TransactionForm>({
    amount: '',
    description: '',
    type: 'EXPENSE',
    category_code: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [transactionsResponse, summaryResponse] = await Promise.all([
          transactionService.getAllTransactions(),
          transactionService.getTransactionSummary(),
        ]);

        if (transactionsResponse.status && transactionsResponse.data) {
          setTransactions(transactionsResponse.data);
        }

        if (summaryResponse.status && summaryResponse.data) {
          setSummary(summaryResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setIsLoading(false);
        setIsLoadingSummary(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleTypeChange = async (type: 'INCOME' | 'EXPENSE') => {
    setFormData(prev => ({ ...prev, type, category_code: '' })); // Reset category when type changes
    setIsLoadingCategories(true);
    try {
      const response = await categoryService.getCategories(type);
      if (response.status && response.data) {
        const formattedCategories: Category[] = response.data.map((cat: ApiCategory) => ({
          code: cat.code,
          name: cat.name,
          icon: cat.icon,
          type: cat.type as 'EXPENSE' | 'INCOME',
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Remove the initial categories fetch from useEffect since we'll fetch when type changes
  useEffect(() => {
    // Initial fetch for default type (EXPENSE)
    handleTypeChange('EXPENSE');
  }, []);

  const filteredTransactions = transactions.filter(tx =>
    (tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    tx.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAmountChange = (value: number) => {
    setFormData(prev => ({ ...prev, amount: value.toString() }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category_code: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, date: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_code || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format the data according to API requirements
      const transactionData = {
        amount: parseInt(formData.amount),
        type: formData.type,
        category_code: formData.category_code,
        date: formData.date,
        ...(formData.description && { description: formData.description }),
      };

      const response = await transactionService.createTransaction(transactionData);
      
      if (response.status) {
        toast.success('Transaction added successfully', {
          description: 'Your transaction has been recorded',
          duration: 3000,
        });

        // Refresh transactions list
        const updatedTransactions = await transactionService.getAllTransactions();
        if (updatedTransactions.status && updatedTransactions.data) {
          setTransactions(updatedTransactions.data);
        }
        setIsFormOpen(false);
        setFormData({
          amount: '',
          description: '',
          type: 'EXPENSE',
          category_code: '',
          date: new Date().toISOString().split('T')[0],
        });
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

  // const TransactionForm = () => (
    
  // );

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your transactions history</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <div className="flex items-center">
                  <ArrowUpIcon className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-green-500">{formatCurrency(summary.total_income)}</span>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Total Expense</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <div className="flex items-center">
                  <ArrowDownIcon className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-2xl font-bold text-red-500">{formatCurrency(summary.total_expense)}</span>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <div className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${summary.total_balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {summary.total_balance >= 0 ? '+' : '-'}
                  </span>
                  <span className={`text-2xl font-bold ${summary.total_balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(Math.abs(summary.total_balance))}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Form Modal */}
        <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Transaction
                </Dialog.Title>
                <Dialog.Close className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <XIcon className="w-5 h-5" />
                </Dialog.Close>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleTypeChange('INCOME')}
                      className={`flex-1 p-3 rounded-lg border ${
                        formData.type === 'INCOME'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <ArrowUpIcon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Income</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange('EXPENSE')}
                      className={`flex-1 p-3 rounded-lg border ${
                        formData.type === 'EXPENSE'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <ArrowDownIcon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Expense</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </label>
                  <FormattedInput
                    value={parseInt(formData.amount) || 0}
                    onChange={handleAmountChange}
                    placeholder="0"
                    prefix="Rp"
                    className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <Select.Root
                    value={formData.category_code}
                    onValueChange={handleCategoryChange}
                    disabled={isLoadingCategories}
                  >
                    <Select.Trigger className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {isLoadingCategories ? (
                        <div className="flex items-center gap-2">
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <Select.Value placeholder="Select category" />
                      )}
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content 
                        className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-[var(--radix-select-trigger-width)]"
                        position="popper"
                        sideOffset={5}
                      >
                        <Select.Viewport>
                          {categories.map((category) => (
                            <Select.Item
                              key={category.code}
                              value={category.code}
                              className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer w-full"
                            >
                              <Select.ItemText>
                                <div className="flex items-center gap-2">
                                  <span>{category.icon}</span>
                                  <span>{category.name}</span>
                                </div>
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    onFocus={(e) => e.target.select()}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Transaction'
                    )}
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Transactions List */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Loading transactions...
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No transactions found
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'INCOME' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          <span className="text-lg">{tx.category_icon}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{tx.category_name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tx.description || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          tx.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
