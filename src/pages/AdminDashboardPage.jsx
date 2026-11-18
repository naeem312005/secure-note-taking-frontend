import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminSubNav from '../components/AdminSubNav';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalNotes: 0, totalPosts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data || { totalUsers: 0, totalNotes: 0, totalPosts: 0 });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admin metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <AdminSubNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Overview</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-800">
              System Admin
            </span>
          </div>
          <p className="text-sm text-gray-600">
            System administration console for user management, system-wide note inspection, and MongoDB aggregation pipelines.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {loading ? (
          <LoadingSpinner text="Loading system metrics..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Users</div>
              <div className="text-3xl font-black text-purple-600">{stats.totalUsers}</div>
              <Link to="/admin/users" className="mt-3 text-xs font-semibold text-purple-600 hover:underline block">
                Manage Users &rarr;
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Notes System-Wide</div>
              <div className="text-3xl font-black text-blue-600">{stats.totalNotes}</div>
              <Link to="/admin/notes" className="mt-3 text-xs font-semibold text-blue-600 hover:underline block">
                View All Notes &rarr;
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Public Posts</div>
              <div className="text-3xl font-black text-emerald-600">{stats.totalPosts}</div>
              <Link to="/posts" className="mt-3 text-xs font-semibold text-emerald-600 hover:underline block">
                View Community Posts &rarr;
              </Link>
            </div>
          </div>
        )}

        <h2 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wider">Administrative Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:border-purple-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
              👥
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">User Management</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add users, change roles, edit profiles, or delete accounts with built-in safeguards (self-deletion & last admin protection).
            </p>
            <Link
              to="/admin/users"
              className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              Open Users &rarr;
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              📝
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">All System Notes</h3>
            <p className="text-sm text-gray-600 mb-4">
              View all notes across all users, supported by the reverse-chronological index <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{"{ createdAt: -1 }"}</code>.
            </p>
            <Link
              to="/admin/notes"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Inspect Notes &rarr;
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
              ⚡
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Scenario 1: Interests Aggregation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Single-pipeline aggregation grouping all users by interest tags using <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">$unwind + $group</code>.
            </p>
            <Link
              to="/admin/aggregations/interests"
              className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View Pipeline Results &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
