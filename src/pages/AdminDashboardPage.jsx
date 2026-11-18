import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminSubNav from '../components/AdminSubNav';
import { Users, FileText, Layers, Compass, ArrowRight, ShieldCheck, Database, Key } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-50/50">
      <AdminSubNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Control Plane
            </span>
            <span className="text-zinc-300">&bull;</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-zinc-900 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              Root Admin Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            System Administration
          </h1>
          <p className="mt-1 text-sm text-zinc-500 max-w-2xl">
            Monitor infrastructure metrics, manage user role permissions, audit system-wide notes, and run single-pass aggregation pipelines.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {loading ? (
          <LoadingSpinner text="Querying system metrics..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider">Registered Accounts</span>
                <Users className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-3xl font-black text-zinc-900 tracking-tight font-mono">
                {stats.totalUsers}
              </div>
              <Link
                to="/admin/users"
                className="mt-3 text-xs font-semibold text-zinc-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
              >
                <span>Manage directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider">Total Vault Notes</span>
                <FileText className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-3xl font-black text-zinc-900 tracking-tight font-mono">
                {stats.totalNotes}
              </div>
              <Link
                to="/admin/notes"
                className="mt-3 text-xs font-semibold text-zinc-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
              >
                <span>Audit all notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider">Published Posts</span>
                <Compass className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-3xl font-black text-zinc-900 tracking-tight font-mono">
                {stats.totalPosts}
              </div>
              <Link
                to="/posts"
                className="mt-3 text-xs font-semibold text-zinc-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
              >
                <span>View community feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Administration Modules */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Management Modules
          </h2>
          <span className="text-xs font-mono text-zinc-400">RBAC: Enforced</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 mb-4">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight mb-1">User Directory</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                Provision users, update roles, edit profiles, or delete accounts with safeguards against self-deletion and last active admin lockout.
              </p>
            </div>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:text-blue-600 transition-colors"
            >
              <span>Open Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 mb-4">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight mb-1">System Notes Audit</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                Inspect all encrypted notes across all accounts with indexed cursor pagination supported by <code className="font-mono text-[11px] text-zinc-700 bg-zinc-100 px-1 py-0.5 rounded">createdAt: -1</code>.
              </p>
            </div>
            <Link
              to="/admin/notes"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:text-blue-600 transition-colors"
            >
              <span>Browse Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 mb-4">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight mb-1">Interest Analytics</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                Execute single-pipeline grouping across all registered interest tags using <code className="font-mono text-[11px] text-zinc-700 bg-zinc-100 px-1 py-0.5 rounded">$unwind + $group</code> stages.
              </p>
            </div>
            <Link
              to="/admin/aggregations/interests"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:text-blue-600 transition-colors"
            >
              <span>Open Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
