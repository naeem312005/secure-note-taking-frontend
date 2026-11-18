import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminSubNav from '../components/AdminSubNav';
import { Database, Code2, ArrowLeft, Calendar, FileText, CheckCircle2, User, Hash } from 'lucide-react';

const UserPostsLookupPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/admin/users/${id}/posts`);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to execute $lookup aggregation query');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [id]);

  const pipelineCode = `// Single-Pipeline Join using MongoDB $lookup
// Starting Collection: db.users.aggregate([...])
[
  // 1. $match: Filter primary user by ObjectId
  { $match: { _id: new mongoose.Types.ObjectId(userId) } },

  // 2. $lookup: Relational join with 'posts' collection
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'userId',
      as: 'posts'
    }
  },

  // 3. $project: Format user details and author post array (exclude password)
  {
    $project: {
      _id: 1,
      name: 1,
      email: 1,
      role: 1,
      interests: 1,
      createdAt: 1,
      posts: {
        $map: {
          input: '$posts',
          as: 'post',
          in: {
            _id: '$$post._id',
            title: '$$post.title',
            content: '$$post.content',
            createdAt: '$$post.createdAt'
          }
        }
      }
    }
  }
]`;

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <AdminSubNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Users Directory</span>
          </Link>

          <button
            onClick={() => setShowCode(!showCode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium shadow-2xs transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>{showCode ? 'Close Spec' : 'Inspect $lookup Pipeline'}</span>
          </button>
        </div>

        {/* Collapsible Pipeline Drawer */}
        {showCode && (
          <div className="mb-6 rounded-xl bg-zinc-950 border border-zinc-800 p-5 shadow-xl text-zinc-100 font-mono text-xs overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
              <div className="flex items-center gap-2 text-zinc-400 font-sans text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                MongoDB $lookup Relational Join &bull; db.users &rarr; db.posts
              </div>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Foreign Field Index: userId_1_createdAt_-1
              </span>
            </div>
            <pre className="text-blue-400/90 leading-relaxed overflow-x-auto text-xs">{pipelineCode}</pre>
          </div>
        )}

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {loading ? (
          <LoadingSpinner text="Executing join pipeline..." />
        ) : !data ? (
          <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center text-zinc-500 shadow-2xs">
            User record not found in database.
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{data.name}</h1>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                    {data.role}
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400 mb-3">{data.email}</div>

                {data.interests && data.interests.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {data.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-50 text-zinc-700 border border-zinc-200/60 font-mono"
                      >
                        <Hash className="w-3 h-3 text-zinc-400" />
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:text-right bg-zinc-50 px-5 py-3.5 rounded-xl border border-zinc-100">
                <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-0.5">
                  Authored Posts
                </div>
                <div className="text-3xl font-black text-zinc-900 tracking-tight font-mono">
                  {data.posts?.length || 0}
                </div>
              </div>
            </div>

            {/* Posts Feed Section */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Posts Joined from Posts Collection
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  {data.posts?.length || 0} items
                </span>
              </div>

              {!data.posts || data.posts.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 text-sm">
                  This user has not published any public posts.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {data.posts.map((post) => (
                    <article key={post._id} className="p-6 hover:bg-zinc-50/60 transition-colors">
                      <h3 className="text-base font-bold text-zinc-900 tracking-tight mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-600 whitespace-pre-line leading-relaxed mb-4">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span>&bull;</span>
                        <span>ID: {post._id}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPostsLookupPage;
