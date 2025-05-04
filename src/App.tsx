import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Transactions from './pages/Transactions';
import Members from './pages/Members';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { isVerifying } = useAuth();
  const [showText, setShowText] = useState(true);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
                <Navbar showText={showText} setShowText={setShowText} />
                <Sidebar showText={showText} />
                <div className="pt-16 pb-16 md:pb-0">
                  <main className={`transition-all duration-300 ${showText ? 'md:ml-64' : 'md:ml-16'}`}>
                    <Profile />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}