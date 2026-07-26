import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/store/AuthContext';
import { ThemeProvider } from '@/store/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AnalyzePage } from '@/pages/AnalyzePage';
import { PickupsPage } from '@/pages/PickupsPage';
import { ComplaintsPage } from '@/pages/ComplaintsPage';
import { ChatPage } from '@/pages/ChatPage';
import { RewardsPage } from '@/pages/RewardsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminWasteAnalysis } from '@/pages/admin/AdminWasteAnalysis';
import { AdminPickups } from '@/pages/admin/AdminPickups';
import { AdminComplaints } from '@/pages/admin/AdminComplaints';
import { AdminNotifications } from '@/pages/admin/AdminNotifications';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminReports } from '@/pages/admin/AdminReports';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { Toaster } from 'sonner';
import type { LanguageCode } from '@/lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const [booted, setBooted] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('en');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            {!booted ? (
              <LoadingScreen onComplete={() => setBooted(true)} />
            ) : (
              <Router>
                <div className="flex flex-col min-h-screen bg-black text-white">
                  <Navbar language={language} onLanguageChange={setLanguage} />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />

                      {/* Protected routes — require login */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute><DashboardPage /></ProtectedRoute>
                      } />
                      <Route path="/analyze" element={
                        <ProtectedRoute><AnalyzePage /></ProtectedRoute>
                      } />
                      <Route path="/pickups" element={
                        <ProtectedRoute><PickupsPage /></ProtectedRoute>
                      } />
                      <Route path="/complaints" element={
                        <ProtectedRoute><ComplaintsPage /></ProtectedRoute>
                      } />
                      <Route path="/chat" element={
                        <ProtectedRoute><ChatPage /></ProtectedRoute>
                      } />
                      <Route path="/rewards" element={
                        <ProtectedRoute><RewardsPage /></ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute><ProfilePage /></ProtectedRoute>
                      } />

                      {/* Admin Module routes group */}
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>
                      }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="waste" element={<AdminWasteAnalysis />} />
                        <Route path="pickups" element={<AdminPickups />} />
                        <Route path="complaints" element={<AdminComplaints />} />
                        <Route path="notifications" element={<AdminNotifications />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="settings" element={<AdminSettings />} />
                      </Route>

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Toaster richColors position="top-right" />
                </div>
              </Router>
            )}
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
