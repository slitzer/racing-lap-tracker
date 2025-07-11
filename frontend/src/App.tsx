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
import ShowcasePage from './pages/ShowcasePage';
import SubmitLapTimePage from './pages/SubmitLapTimePage';
import AdminPage from './pages/AdminPage';
import InfoSearchPage from './pages/InfoSearchPage';
import TrackDetailPage from './pages/TrackDetailPage';
import CarDetailPage from './pages/CarDetailPage';
import GameDetailPage from './pages/GameDetailPage';
import InfoPage from './pages/InfoPage';
import { useLocation } from 'react-router-dom';
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
  const InfoRoute = () => {
    const location = useLocation();
    const path = location.pathname.replace(/^\/info/, '/GamePack');
    return <InfoPage path={path} />;
  };
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
                  <Route path="/showcase" element={<ShowcasePage />} />
                  <Route path="/track/:id" element={<TrackDetailPage />} />
                  <Route path="/car/:id" element={<CarDetailPage />} />
                  <Route path="/game/:id" element={<GameDetailPage />} />
                  <Route path="/info/*" element={<InfoRoute />} />
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
                  <Route
                    path="/admin/search"
                    element={
                      <ProtectedRoute requireAdmin>
                        <InfoSearchPage />
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