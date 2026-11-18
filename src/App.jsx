import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import NotesListPage from './pages/NotesListPage';
import CreateNotePage from './pages/CreateNotePage';
import EditNotePage from './pages/EditNotePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import AllNotesPage from './pages/AllNotesPage';
import PublicPostsPage from './pages/PublicPostsPage';
import InterestsAggregationPage from './pages/InterestsAggregationPage';
import UserPostsLookupPage from './pages/UserPostsLookupPage';
import NotFoundPage from './pages/NotFoundPage';

// Root redirect component
const RootRedirect = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/posts" replace />;
  return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Root redirect */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/posts" element={<PublicPostsPage />} />

              {/* Protected user routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboardPage />} />
                <Route path="/notes" element={<NotesListPage />} />
                <Route path="/notes/create" element={<CreateNotePage />} />
                <Route path="/notes/edit/:id" element={<EditNotePage />} />
              </Route>

              {/* Protected admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/notes" element={<AllNotesPage />} />
                <Route path="/admin/aggregations/interests" element={<InterestsAggregationPage />} />
                <Route path="/admin/users/:id/posts" element={<UserPostsLookupPage />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
            CareGuide Secure Note-Taking Application &bull; Technical Interview Assignment &bull; 2026
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
