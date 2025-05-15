import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
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
        return <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />;
      case 'Total Period Expenses':
        return <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />;
      case 'Total Period Income':
        return <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />;
      default:
        return null;
    }
  };

  const getTextColor = (label: string) => {
    switch (label) {
      case 'Total Period Expenses':
        return 'text-red-500';
      default:
        return 'text-green-500';
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
        <Card key={item.label} className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(item.value)}
              </span>
              <div className="flex items-center mt-2">
                {getIcon(item.label)}
                <span className={`text-sm ${getTextColor(item.label)}`}>{item.percent}%</span>
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
  