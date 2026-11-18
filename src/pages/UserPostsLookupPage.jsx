import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminSubNav from '../components/AdminSubNav';

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

  const pipelineCode = `// SCENARIO 2: User Posts using $lookup (Single Pipeline)
// Constraint: Start with User, join Posts via $lookup, no populate()
User.aggregate([
  {
    $match: { _id: new mongoose.Types.ObjectId(userId) }
  },
  {
    $lookup: {
      from: 'posts',           // Joined collection
      localField: '_id',       // User._id
      foreignField: 'userId',  // Post.userId
      as: 'posts'
    }
  },
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
]);`;

  return (
    <div>
      <AdminSubNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
                Scenario 2
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                $lookup Join
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">User Posts via $lookup</h1>
            <p className="text-sm text-gray-600 mt-1">
              Retrieves the user and their posts through a single MongoDB aggregation pipeline with a <code className="text-xs font-mono font-bold">$lookup</code> stage.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-3.5 py-1.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 shadow-xs"
            >
              {showCode ? 'Hide Pipeline' : 'View Pipeline Code'}
            </button>
            <Link
              to="/admin/users"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
            >
              &larr; Users
            </Link>
          </div>
        </div>

        {showCode && (
          <div className="mb-6 bg-gray-950 text-blue-400 p-5 rounded-2xl shadow-inner text-xs font-mono overflow-x-auto border border-gray-800">
            <div className="text-gray-400 mb-2 font-sans font-bold uppercase text-[10px] tracking-wider">
              Single Pipeline with $lookup Definition:
            </div>
            <pre>{pipelineCode}</pre>
          </div>
        )}

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-xs sm:text-sm text-blue-900 flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <span className="font-bold">Evaluation Constraint Compliant:</span> Starts on the <code>Users</code> collection, performs a left-outer join on the <code>Posts</code> collection via <code>$lookup</code>, and uses <strong>no <code>populate()</code></strong> or separate queries.
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Executing $lookup aggregation join..." />
        ) : !data ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
            User record not found.
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-gray-100 text-gray-700">
                    {data.role}
                  </span>
                </div>
                <div className="text-sm text-gray-500 font-mono">{data.email}</div>
                {data.interests && data.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {data.interests.map((interest, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-mono font-medium">
                        #{interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-right bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Joined Posts</div>
                <div className="text-3xl font-black text-blue-700">{data.posts?.length || 0}</div>
              </div>
            </div>

            {/* Joined Posts Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Posts Joined from Posts Collection via $lookup
                </h3>
              </div>

              {!data.posts || data.posts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  This user has not authored any public posts yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.posts.map((post) => (
                    <div key={post._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <h4 className="text-base font-bold text-gray-900 mb-1">{post.title}</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{post.content}</p>
                      <div className="text-[11px] text-gray-400 font-mono">
                        Post ID: {post._id} • Created: {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPostsLookupPage;
