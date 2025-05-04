import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, SettingsIcon, LogOutIcon, User } from 'lucide-react';

interface NavbarProps {
  showText: boolean;
  setShowText: (show: boolean) => void;
}

export default function Navbar({ showText, setShowText }: NavbarProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={() => setShowText(!showText)}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-3 profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center max-w-xs text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <span className="ml-2 mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                  <div
                    onClick={handleProfileClick}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Edit Profile
                  </div>
                  <div
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}