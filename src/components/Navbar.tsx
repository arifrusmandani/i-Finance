import * as Switch from '@radix-ui/react-switch';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavbarProps {
  showText: boolean;
  setShowText: (show: boolean) => void;
}

export default function Navbar({ showText, setShowText }: NavbarProps) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Toggle Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {showText ? "FinanceApp" : "FX"}
            </h1>
            <button
              onClick={() => setShowText(!showText)}
              className="hidden md:block p-1.5 sm:p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              title={showText ? "Show Icons Only" : "Show Icons and Text"}
            >
              {showText ? <Menu size={18} className="sm:w-5 sm:h-5" /> : <X size={18} className="sm:w-5 sm:h-5" />}
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Switch.Root
              className="w-8 h-5 sm:w-10 sm:h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            >
              <Switch.Thumb className="block w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow transition-transform translate-x-1 data-[state=checked]:translate-x-4 sm:data-[state=checked]:translate-x-5" />
            </Switch.Root>
            {darkMode ? <Moon className="text-white w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="text-black w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
        </div>
      </div>
    </nav>
  );
}