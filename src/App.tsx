import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Transactions from './pages/Transactions';
import Members from './pages/Members';
import Reports from './pages/Reports';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const [showText, setShowText] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
                  <Navbar showText={showText} setShowText={setShowText} />
                  <Sidebar showText={showText} />
                  <div className="pt-16 pb-16 md:pb-0">
                    <main className={`transition-all duration-300 ${showText ? 'md:ml-64' : 'md:ml-16'}`}>
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
                  <Navbar showText={showText} setShowText={setShowText} />
                  <Sidebar showText={showText} />
                  <div className="pt-16 pb-16 md:pb-0">
                    <main className={`transition-all duration-300 ${showText ? 'md:ml-64' : 'md:ml-16'}`}>
                      <Transactions />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
                  <Navbar showText={showText} setShowText={setShowText} />
                  <Sidebar showText={showText} />
                  <div className="pt-16 pb-16 md:pb-0">
                    <main className={`transition-all duration-300 ${showText ? 'md:ml-64' : 'md:ml-16'}`}>
                      <Members />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
                  <Navbar showText={showText} setShowText={setShowText} />
                  <Sidebar showText={showText} />
                  <div className="pt-16 pb-16 md:pb-0">
                    <main className={`transition-all duration-300 ${showText ? 'md:ml-64' : 'md:ml-16'}`}>
                      <Reports />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}