import React from 'react';
import { Card, CardContent } from './ui/card';
import { WifiIcon, HomeIcon, UserIcon, CloudIcon, PlusIcon } from 'lucide-react';

interface QuickActionButton {
  icon: JSX.Element;
  label: string;
  color: string;
}

export default function FastTransaction() {
  const quickActions: QuickActionButton[] = [
    {
      icon: <WifiIcon className="w-6 h-6" />,
      label: 'Mobile',
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      icon: <HomeIcon className="w-6 h-6" />,
      label: 'Housing',
      color: 'bg-indigo-400 hover:bg-indigo-500'
    },
    {
      icon: <UserIcon className="w-6 h-6" />,
      label: 'John',
      color: 'bg-purple-400 hover:bg-purple-500'
    },
    {
      icon: <CloudIcon className="w-6 h-6" />,
      label: 'Cloud',
      color: 'bg-amber-400 hover:bg-amber-500'
    },
    {
      icon: <PlusIcon className="w-6 h-6" />,
      label: 'Add',
      color: 'bg-green-400 hover:bg-green-500'
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Fast transaction:</h3>
        <div className="flex flex-wrap gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`${action.color} text-white p-4 rounded-full transition-colors duration-200 flex flex-col items-center gap-2`}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 