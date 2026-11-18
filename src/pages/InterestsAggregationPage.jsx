import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminSubNav from '../components/AdminSubNav';
import { Layers, Code2, Users, Database, Sparkles, CheckCircle2, ChevronRight, Hash } from 'lucide-react';

const InterestsAggregationPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const fetchAggregation = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/admin/aggregations/users-by-interest');
        setData(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to execute aggregation query');
      } finally {
        setLoading(false);
      }
    };

    fetchAggregation();
  }, []);

  const totalMembersCount = data.reduce((acc, curr) => acc + (curr.totalUsers || 0), 0);

  const pipelineCode = `// Single-Pipeline MongoDB Aggregation: Group Users by Interests
// Collection: db.users.aggregate([...])
[
  // 1. $match: Filter out users with empty/missing interests
  { $match: { interests: { $exists: true, $type: 'array', $ne: [] } } },

  // 2. $unwind: Deconstruct array into distinct interest documents
  { $unwind: '$interests' },

  // 3. $match: Sanitize interest values (non-empty strings only)
  { $match: { interests: { $type: 'string', $nin: ['', null] } } },

  // 4. $group: Group by interest and accumulate unique user names
  { $group: { _id: '$interests', users: { $addToSet: '$name' } } },

  // 5. $project: Shape document with computed totalUsers size
  { $project: { _id: 1, users: 1, totalUsers: { $size: '$users' } } },

  // 6. $sort: Rank by totalUsers descending, then alphabetical
  { $sort: { totalUsers: -1, _id: 1 } }
]`;

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <AdminSubNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono font-medium text-zinc-500">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                <Database className="w-3 h-3 text-zinc-400" />
                Aggregations
              </span>
              <span>/</span>
              <span className="text-zinc-700 font-semibold">Interest Clusters</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              User Interest Analytics
            </h1>
            <p className="mt-1 text-sm text-zinc-500 max-w-2xl">
              Dynamically groups and aggregates user profiles across shared interests using a single-pass MongoDB aggregation pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCode(!showCode)}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium shadow-2xs transition-all"
            >
              <Code2 className="w-4 h-4 text-zinc-500" />
              <span>{showCode ? 'Close Pipeline Spec' : 'Inspect Pipeline Code'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Pipeline Drawer */}
        {showCode && (
          <div className="mb-8 rounded-xl bg-zinc-950 border border-zinc-800 p-5 shadow-xl text-zinc-100 font-mono text-xs overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
              <div className="flex items-center gap-2 text-zinc-400 font-sans text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Single-Pass Pipeline Architecture &bull; 6 Stages
              </div>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                O(N) Streaming
              </span>
            </div>
            <pre className="text-emerald-400/90 leading-relaxed overflow-x-auto text-xs">{pipelineCode}</pre>
          </div>
        )}

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* High-craft summary status bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-2xs">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Active Interest Clusters
            </div>
            <div className="text-2xl font-bold text-zinc-900 tracking-tight flex items-baseline gap-2">
              <span>{data.length}</span>
              <span className="text-xs text-zinc-400 font-normal">categories</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-2xs">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Cluster User Assignments
            </div>
            <div className="text-2xl font-bold text-zinc-900 tracking-tight flex items-baseline gap-2">
              <span>{totalMembersCount}</span>
              <span className="text-xs text-zinc-400 font-normal">total pairings</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Execution Guarantee
              </div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero Memory Leaks &bull; 1 Query
              </div>
            </div>
            <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
              aggregate()
            </span>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <LoadingSpinner text="Running pipeline aggregation..." />
        ) : data.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-zinc-200/80 text-center text-zinc-500 shadow-2xs">
            <Users className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="font-medium text-sm text-zinc-700">No interest clusters yet</p>
            <p className="text-xs text-zinc-400 mt-1">Users have not tagged any interests in their profiles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((group) => {
              const percentage = totalMembersCount > 0 ? Math.round((group.totalUsers / totalMembersCount) * 100) : 0;
              return (
                <div
                  key={group._id}
                  className="bg-white rounded-xl border border-zinc-200/80 shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all p-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          <Hash className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-bold text-zinc-900 text-base capitalize tracking-tight">
                          {group._id}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                        {group.totalUsers} {group.totalUsers === 1 ? 'user' : 'users'}
                      </span>
                    </div>

                    {/* Associated Users */}
                    <div className="my-3">
                      <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
                        Members
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.users.map((userName, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-50 border border-zinc-200/70 text-zinc-800"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                            {userName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Relative Density Indicator */}
                  <div className="pt-3 mt-4 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Density share</span>
                      <span className="font-mono">{percentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-zinc-900 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default InterestsAggregationPage;
