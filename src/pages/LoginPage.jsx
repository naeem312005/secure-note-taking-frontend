import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionExpired = searchParams.get('sessionExpired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const autofill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50/50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-zinc-200/80">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 mx-auto mb-4 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">Sign in to CareGuide</h1>
          <p className="mt-1.5 text-xs text-zinc-500">
            Secure vault authentication backed by JWT and bcrypt
          </p>
        </div>

        {sessionExpired && (
          <Alert type="warning" message="Session expired. Please sign in again." />
        )}

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Authenticating...' : 'Continue'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-zinc-900 hover:underline">
            Sign up
          </Link>
        </div>

        {/* Demo Credentials Quick-Fill */}
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
            <KeyRound className="w-3 h-3" />
            Quick Demo Accounts:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => autofill('admin@example.com', 'Admin@123456')}
              className="p-2.5 text-left border border-zinc-200/80 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              <div className="font-semibold text-zinc-900 text-[11px] flex items-center justify-between">
                <span>Admin</span>
                <span className="text-[9px] font-mono bg-zinc-100 text-zinc-700 px-1 py-0.2 rounded">ROOT</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">admin@example.com</div>
            </button>

            <button
              type="button"
              onClick={() => autofill('naeem@example.com', 'Password@123')}
              className="p-2.5 text-left border border-zinc-200/80 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              <div className="font-semibold text-zinc-900 text-[11px] flex items-center justify-between">
                <span>User (Naeem)</span>
                <span className="text-[9px] font-mono bg-zinc-100 text-zinc-700 px-1 py-0.2 rounded">USER</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">naeem@example.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
