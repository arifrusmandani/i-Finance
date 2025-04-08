import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Users, FileText, User } from 'lucide-react';

interface SidebarProps {
  showText: boolean;
}

export default function Sidebar({ showText }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: Wallet, label: 'Transaksi' },
    { path: '/members', icon: Users, label: 'Anggota' },
    { path: '/reports', icon: FileText, label: 'Laporan' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${showText ? 'w-64' : 'w-16'} z-40 hidden md:block`}>
        <div className="h-full py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${showText ? 'px-4' : 'justify-center'} py-3 rounded-md transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    title={!showText ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {showText && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-40 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300'
                  }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
} 