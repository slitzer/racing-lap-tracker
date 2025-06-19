/**
 * Main App Component
 * Created by MiniMax Agent
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ui/theme-provider';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import LapTimesPage from './pages/LapTimesPage';
import SubmitLapTimePage from './pages/SubmitLapTimePage';
import AdminPage from './pages/AdminPage';
import TrackDetailPage from './pages/TrackDetailPage';
import './App.css';
// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="racing-tracker-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected routes with layout */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/lap-times" element={<LapTimesPage />} />
                  <Route path="/track/:id" element={<TrackDetailPage />} />
                  <Route 
                    path="/submit" 
                    element={
                      <ProtectedRoute>
                        <SubmitLapTimePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile/:username?" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminPage />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
                
                {/* 404 fallback */}
                <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
              </Routes>
              
              {/* Toast notifications */}
              <Toaster richColors position="top-right" />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
export default App;