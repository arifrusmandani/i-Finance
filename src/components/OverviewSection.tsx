import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { ArrowUpIcon, ArrowDownIcon, WalletIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { reportService, DashboardSummaryItem } from '../services/report.service';

export default function OverviewSection() {
  const [summaryData, setSummaryData] = useState<DashboardSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setIsLoading(true);
        const response = await reportService.getDashboardSummary();
        if (response.status && response.data) {
          setSummaryData(response.data);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard summary:', err);
        setError('Failed to load dashboard summary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  const getIcon = (label: string) => {
    switch (label) {
      case 'Total Balance':
        return <WalletIcon className="w-5 h-5 text-white" />;
      case 'Total Period Income':
        return <TrendingUpIcon className="w-5 h-5 text-white" />;
      case 'Total Period Expenses':
        return <TrendingDownIcon className="w-5 h-5 text-white" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {summaryData.map((item) => (
        <Card key={item.label} className="overflow-hidden relative">
          {/* Gradient Background */}
          <div className={`absolute inset-0 ${
            item.label === 'Total Balance' 
              ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20'
              : item.label === 'Total Period Income'
              ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20'
              : 'bg-gradient-to-br from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20'
          }`} />
          
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              {/* Icon Container */}
              <div className={`p-2 rounded-lg ${
                item.label === 'Total Balance'
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                  : item.label === 'Total Period Income'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-rose-500 to-pink-500'
              } shadow-lg`}>
                {getIcon(item.label)}
              </div>
              <span className={`text-sm font-medium ${
                item.label === 'Total Balance'
                  ? 'text-blue-600 dark:text-blue-400'
                  : item.label === 'Total Period Income'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {item.label}
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(item.value)}
              </h3>
              <div className="flex items-center mt-2">
                <div className={`flex items-center ${
                  item.label === 'Total Period Expenses' ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {item.label === 'Total Period Expenses' ? 
                    <ArrowDownIcon className="w-4 h-4 mr-1" /> : 
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                  }
                  <span className="text-sm">{item.percent}%</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  Last month {formatCurrency(item.last_month)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
  