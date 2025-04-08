// src/pages/Transactions.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowDownIcon, ArrowUpIcon, FilterIcon, PlusIcon, SearchIcon } from 'lucide-react';

type Transaction = {
  id: number;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  tipe: 'Pemasukan' | 'Pengeluaran';
};

const dummyTransactions: Transaction[] = [
  { id: 1, tanggal: '2025-04-01', kategori: 'Gaji', deskripsi: 'Gaji bulan April', jumlah: 7000000, tipe: 'Pemasukan' },
  { id: 2, tanggal: '2025-04-02', kategori: 'Belanja', deskripsi: 'Belanja bulanan', jumlah: 1500000, tipe: 'Pengeluaran' },
  { id: 3, tanggal: '2025-04-03', kategori: 'Transportasi', deskripsi: 'Bensin motor', jumlah: 250000, tipe: 'Pengeluaran' },
];

export default function Transactions() {
  const [transactions] = useState<Transaction[]>(dummyTransactions);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx =>
    tx.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions
    .filter(tx => tx.tipe === 'Pemasukan')
    .reduce((sum, tx) => sum + tx.jumlah, 0);

  const totalExpense = transactions
    .filter(tx => tx.tipe === 'Pengeluaran')
    .reduce((sum, tx) => sum + tx.jumlah, 0);

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your transactions history</p>
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
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

        {/* Transactions List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.tipe === 'Pemasukan' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20' 
                          : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                      }`}>
                        {tx.tipe === 'Pemasukan' ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{tx.deskripsi}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{tx.kategori}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        tx.tipe === 'Pemasukan' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {tx.tipe === 'Pemasukan' ? '+' : '-'} {formatCurrency(tx.jumlah)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(tx.tanggal)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
