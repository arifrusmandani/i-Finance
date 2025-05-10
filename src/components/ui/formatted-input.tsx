import React, { useState, useEffect } from 'react';
import { Input } from './input';

interface FormattedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number;
  onChange?: (value: number) => void;
  prefix?: string;
}

export function FormattedInput({ value = '', onChange, prefix, ...props }: FormattedInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d]/g, '')) : value;
      setDisplayValue(formatNumber(numericValue));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, '');
    const numericValue = inputValue ? parseInt(inputValue, 10) : 0;
    
    setDisplayValue(formatNumber(numericValue));
    onChange?.(numericValue);
  };

  return (
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          {prefix}
        </div>
      )}
      <Input
        {...props}
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={`${prefix ? 'pl-12' : ''} ${props.className || ''}`}
      />
    </div>
  );
} 