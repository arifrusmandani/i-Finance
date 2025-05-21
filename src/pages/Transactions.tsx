// src/pages/Transactions.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, formatDate } from '../lib/utils';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  FilterIcon, 
  PlusIcon, 
  SearchIcon, 
  XIcon,
  UploadIcon,
  DownloadIcon,
  FileIcon,
  AlertCircleIcon,
  Trash2Icon
} from 'lucide-react';
import { transactionService, Transaction as ServiceTransaction, TransactionSummary } from '../services/transaction.service';
import { categoryService } from '../services/category.service';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { toast, Toaster } from 'sonner';
import { FormattedInput } from '../components/ui/formatted-input';
import * as XLSX from 'xlsx';
import { useSwipeable } from 'react-swipeable';

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

interface ExcelUploadState {
  isOpen: boolean;
  file: File | null;
  preview: {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    description: string;
    date: string;
    category_code: string;
  }[];
  isUploading: boolean;
  error: string | null;
}

interface TransactionItemProps {
  transaction: ServiceTransaction;
  onDelete: (id: number) => void;
}

function TransactionItem({ transaction: tx, onDelete }: TransactionItemProps) {
  const [isSwiped, setIsSwiped] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIsSwiped(true),
    onSwipedRight: () => setIsSwiped(false),
    trackMouse: false,
    delta: 10,
    swipeDuration: 500,
  });

  const handleDelete = () => {
    onDelete(tx.id);
    setIsSwiped(false);
  };

  return (
    <div 
      className="group relative overflow-hidden"
      {...swipeHandlers}
    >
      <div 
        className={`relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 ease-in-out ${
          isSwiped ? 'translate-x-[-80px]' : 'translate-x-0'
        }`}
      >
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
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className={`text-sm font-medium ${
                tx.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(tx.date)}</p>
            </div>
            {/* Desktop Delete Button */}
            <button
              onClick={handleDelete}
              className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
              title="Delete transaction"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Delete Button */}
      <div 
        className={`absolute top-0 right-0 h-full w-20 bg-red-500 flex items-center justify-center transition-transform duration-300 ease-in-out ${
          isSwiped ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={handleDelete}
          className="p-4 text-white focus:outline-none"
        >
          <Trash2Icon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

const parseExcelFile = async (file: File) => {
  return new Promise<XLSX.WorkBook>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

const validateExcelData = (data: Record<string, string | number>[]) => {
  const requiredHeaders = ['amount', 'type', 'description', 'date', 'category_code'];
  const headers = Object.keys(data[0] || {});

  // Check if all required headers exist
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }

  // Filter out completely empty rows first
  const nonEmptyRows = data.filter(row => {
    // Check if all required fields are empty
    const isEmptyRow = requiredHeaders.every(header => {
      const value = row[header];
      return value === null || value === undefined || value === '' || value === ' ';
    });
    return !isEmptyRow;
  });

  // Validate data types and format
  const validatedData = nonEmptyRows.map((row, index) => {
    const errors: string[] = [];

    // Check for empty required fields
    requiredHeaders.forEach(header => {
      const value = row[header];
      if (value === null || value === undefined || value === '' || value === ' ') {
        errors.push(`Row ${index + 2}: ${header} is required`);
      }
    });

    // Validate amount
    if (row.amount) {
      if (isNaN(Number(row.amount))) {
        errors.push(`Row ${index + 2}: Amount must be a number`);
      }
    }

    // Validate type
    if (row.type) {
      if (!['INCOME', 'EXPENSE'].includes(row.type as string)) {
        errors.push(`Row ${index + 2}: Type must be either INCOME or EXPENSE`);
      }
    }

    // Validate and format date
    let formattedDate: string;
    const dateValue = row.date;

    try {
      // Handle Excel date (number)
      if (typeof dateValue === 'number') {
        // Convert Excel date number to YYYY-MM-DD
        const date = new Date((dateValue - 25569) * 86400 * 1000);
        formattedDate = date.toISOString().split('T')[0];
      } 
      // Handle string date
      else if (typeof dateValue === 'string') {
        // Check for DD/MM/YYYY format
        if (dateValue.includes('/')) {
          const [day, month, year] = dateValue.split('/');
          if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
            errors.push(`Row ${index + 2}: Date must be in DD/MM/YYYY format`);
          } else {
            formattedDate = `${year}-${month}-${day}`;
          }
        } 
        // Check for YYYY-MM-DD format
        else {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(dateValue)) {
            errors.push(`Row ${index + 2}: Date must be in YYYY-MM-DD format`);
          } else {
            formattedDate = dateValue;
          }
        }
      } else {
        errors.push(`Row ${index + 2}: Invalid date format`);
      }
    } catch {
      errors.push(`Row ${index + 2}: Invalid date value`);
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return {
      amount: Number(row.amount),
      type: row.type as 'INCOME' | 'EXPENSE',
      description: (row.description as string) || '',
      date: formattedDate!,
      category_code: row.category_code as string
    };
  });

  if (validatedData.length === 0) {
    throw new Error('No valid data found in the Excel file');
  }

  return validatedData;
};

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
  const [excelUpload, setExcelUpload] = useState<ExcelUploadState>({
    isOpen: false,
    file: null,
    preview: [],
    isUploading: false,
    error: null
  });

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const [transactionsResponse, summaryResponse] = await Promise.all([
          transactionService.getAllTransactions(offset, itemsPerPage),
          transactionService.getTransactionSummary(),
        ]);

        if (transactionsResponse.status && transactionsResponse.data) {
          setTransactions(transactionsResponse.data);
          setTotalRecords(transactionsResponse.record_count || 0);
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
  }, [currentPage]); // Re-fetch when page changes

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
          file.type !== 'application/vnd.ms-excel') {
        setExcelUpload(prev => ({ ...prev, error: 'Please upload a valid Excel file (.xlsx or .xls)' }));
        return;
      }

      try {
        setExcelUpload(prev => ({ ...prev, file, error: null }));
        const workbook = await parseExcelFile(file);
        
        // Check if 'transaction' sheet exists
        if (!workbook.SheetNames.includes('transaction')) {
          throw new Error('Sheet "transaction" not found in the Excel file');
        }

        // Get the transaction sheet
        const worksheet = workbook.Sheets['transaction'];
        const data = XLSX.utils.sheet_to_json(worksheet) as Record<string, string | number>[];

        // Validate and transform data
        const validatedData = validateExcelData(data);
        
        setExcelUpload(prev => ({ 
          ...prev, 
          preview: validatedData,
          error: null 
        }));
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setExcelUpload(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Failed to parse Excel file' 
        }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
          file.type !== 'application/vnd.ms-excel') {
        setExcelUpload(prev => ({ ...prev, error: 'Please upload a valid Excel file (.xlsx or .xls)' }));
        return;
      }

      try {
        setExcelUpload(prev => ({ ...prev, file, error: null }));
        const workbook = await parseExcelFile(file);
        
        // Check if 'transaction' sheet exists
        if (!workbook.SheetNames.includes('transaction')) {
          throw new Error('Sheet "transaction" not found in the Excel file');
        }

        // Get the transaction sheet
        const worksheet = workbook.Sheets['transaction'];
        const data = XLSX.utils.sheet_to_json(worksheet) as Record<string, string | number>[];

        // Validate and transform data
        const validatedData = validateExcelData(data);
        
        setExcelUpload(prev => ({ 
          ...prev, 
          preview: validatedData,
          error: null 
        }));
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setExcelUpload(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Failed to parse Excel file' 
        }));
      }
    }
  };

  const handleUpload = async () => {
    if (!excelUpload.file) return;

    try {
      setExcelUpload(prev => ({ ...prev, isUploading: true }));
      
      const response = await transactionService.bulkUploadTransactions(excelUpload.file);
      
      if (response.status) {
        toast.success(response.message || 'Transactions imported successfully', {
          description: `${response.data.total_rows} rows imported successfully`,
          duration: 5000,
        });

        // Refresh transactions list
        const updatedTransactions = await transactionService.getAllTransactions();
        if (updatedTransactions.status && updatedTransactions.data) {
          setTransactions(updatedTransactions.data);
        }

        // Refresh summary
        const summaryResponse = await transactionService.getTransactionSummary();
        if (summaryResponse.status && summaryResponse.data) {
          setSummary(summaryResponse.data);
        }

        // Reset form and close popup
        setExcelUpload({
          isOpen: false,
          file: null,
          preview: [],
          isUploading: false,
          error: null
        });
      } else {
        toast.error(response.message || 'Failed to import transactions', {
          description: 'Please check your file and try again',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Failed to upload transactions:', error);
      toast.error('Failed to import transactions', {
        description: error instanceof Error ? error.message : 'Please try again later',
        duration: 5000,
      });
    } finally {
      setExcelUpload(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await transactionService.deleteTransaction(id);
      
      if (response.status) {
        toast.success('Transaction deleted successfully');
        
        // Refresh transactions list
        const offset = (currentPage - 1) * itemsPerPage;
        const updatedTransactions = await transactionService.getAllTransactions(offset, itemsPerPage);
        if (updatedTransactions.status && updatedTransactions.data) {
          setTransactions(updatedTransactions.data);
          setTotalRecords(updatedTransactions.record_count || 0);
        }

        // Refresh summary
        const summaryResponse = await transactionService.getTransactionSummary();
        if (summaryResponse.status && summaryResponse.data) {
          setSummary(summaryResponse.data);
        }
      } else {
        toast.error('Failed to delete transaction', {
          description: response.message || 'Please try again later',
        });
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      toast.error('Failed to delete transaction', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    }
  };

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your transactions history</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setExcelUpload(prev => ({ ...prev, isOpen: true }))}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Import Excel
            </button>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total Balance Card (Full width on mobile, first item in grid on md+) */}
          <Card className="bg-white dark:bg-gray-800 md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {isLoadingSummary ? (
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <div className="flex items-center">
                  <span className={`text-xl font-bold ${summary.total_balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(summary.total_balance)}
                  </span>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Income and Expense Cards (2 columns on mobile, occupy remaining space on md+) */}
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Income</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoadingSummary ? (
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                ) : (              
                <div className="flex items-center">
                  <ArrowUpIcon className="w-4 h-4 text-blue-500 mr-1.5" />
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(summary.total_income)}</span>
                </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Expense</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoadingSummary ? (
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                ) : (              
                <div className="flex items-center">
                  <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1.5" />
                    <span className="text-xl font-bold text-red-600">{formatCurrency(summary.total_expense)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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

        {/* Excel Upload Modal */}
        <Dialog.Root open={excelUpload.isOpen} onOpenChange={(open) => setExcelUpload(prev => ({ ...prev, isOpen: open }))}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  Import Transactions from Excel
                </Dialog.Title>
                <Dialog.Close className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <XIcon className="w-5 h-5" />
                </Dialog.Close>
              </div>

              <div className="space-y-6">
                {/* Template Download Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <FileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Download Template</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Use our template to ensure your data is formatted correctly.
                      </p>
                      <a 
                        href="/templates/transaction_template.xlsx" 
                        download
                        className="inline-flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <DownloadIcon className="w-4 h-4 mr-1" />
                        Download Template
                      </a>
                    </div>
                  </div>
                </div>

                {/* Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    excelUpload.error 
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-upload"
                    disabled={excelUpload.isUploading}
                  />
                  <label 
                    htmlFor="excel-upload"
                    className={`cursor-pointer ${excelUpload.isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {excelUpload.isUploading ? (
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <UploadIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {excelUpload.isUploading 
                            ? 'Uploading...' 
                            : excelUpload.file 
                              ? excelUpload.file.name 
                              : 'Drop your Excel file here'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {excelUpload.isUploading ? 'Please wait...' : 'or click to browse'}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Error Message */}
                {excelUpload.error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span>{excelUpload.error}</span>
                  </div>
                )}

                {/* Preview Section */}
                {excelUpload.preview.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Preview</h3>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Date</th>
                              <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Type</th>
                              <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Category</th>
                              <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Amount</th>
                              <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {excelUpload.preview.map((row, index) => {
                              // Convert YYYY-MM-DD to DD-MM-YYYY for display
                              const [year, month, day] = row.date.split('-');
                              const displayDate = `${day}-${month}-${year}`;
                              
                              return (
                                <tr key={index} className="bg-white dark:bg-gray-900">
                                  <td className="px-4 py-2 text-gray-900 dark:text-white">{displayDate}</td>
                                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.type}</td>
                                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.category_code}</td>
                                  <td className="px-4 py-2 text-gray-900 dark:text-white">{formatCurrency(row.amount)}</td>
                                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.description || '-'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setExcelUpload({
                      isOpen: false,
                      file: null,
                      preview: [],
                      isUploading: false,
                      error: null
                    })}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled={excelUpload.isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!excelUpload.file || excelUpload.isUploading}
                  >
                    {excelUpload.isUploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      'Upload Transactions'
                    )}
                  </button>
                </div>
              </div>
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
                <>
                  {filteredTransactions.map((tx) => (
                    <TransactionItem
                      key={tx.id}
                      transaction={tx}
                      onDelete={handleDelete}
                    />
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalRecords)}</span> of{' '}
                            <span className="font-medium">{totalRecords}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Previous</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                              // Show first page, last page, current page, and pages around current page
                              if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                      page === currentPage
                                        ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                );
                              } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                              ) {
                                return (
                                  <span
                                    key={page}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                                  >
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            })}

                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Next</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
