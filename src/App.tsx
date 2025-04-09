import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Members from './pages/Members';
import Reports from './pages/Reports';

export default function App() {
  const [showText, setShowText] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <Navbar showText={showText} setShowText={setShowText} />
        <Sidebar showText={showText} />
        <div className="pt-16 pb-16 md:pb-0">
          <main className={`transition-all duration-300 ${showText ? 'md:ml-64' : 'md:ml-16'}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/members" element={<Members />} />
              <Route path="/reports" element={<Reports />} />
              {/* Route lainnya bisa ditambahkan di sini */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}