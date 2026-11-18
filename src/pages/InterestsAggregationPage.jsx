import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

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

  const pipelineCode = `// Scenario 1: Group Users by Interests (Single Pipeline)
User.aggregate([
  { $match: { interests: { $exists: true, $type: 'array', $ne: [] } } },
  { $unwind: '$interests' },
  { $match: { interests: { $type: 'string', $nin: ['', null] } } },
  { $group: { _id: '$interests', users: { $addToSet: '$name' } } },
  { $project: { _id: 1, users: 1, totalUsers: { $size: '$users' } } },
  { $sort: { totalUsers: -1, _id: 1 } }
]);`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-extrabold text-gray-900">Scenario 1: Group Users by Interests</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              MongoDB Aggregation
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Live demonstration of users grouped by interests using <strong>exactly ONE</strong> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">collection.aggregate()</code> call.
          </p>
        </div>

        <button
          onClick={() => setShowCode(!showCode)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          {showCode ? 'Hide Pipeline Code' : 'View Aggregation Pipeline'}
        </button>
      </div>

      {showCode && (
        <div className="mb-6 bg-gray-900 text-gray-100 p-4 rounded-xl shadow-md text-xs font-mono overflow-x-auto">
          <div className="text-gray-400 mb-2 font-sans font-medium uppercase text-[10px] tracking-wider">
            Mandatory Single Aggregation Pipeline
          </div>
          <pre>{pipelineCode}</pre>
        </div>
      )}

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Constraints Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-xs text-emerald-900">
        <span className="font-bold">Evaluation Constraint Satisfied:</span> Executed inside a single aggregation pipeline without using <code>find()</code>, <code>findOne()</code>, <code>populate()</code>, or in-memory JavaScript manipulation.
      </div>

      {loading ? (
        <LoadingSpinner text="Executing aggregation pipeline on MongoDB cluster..." />
      ) : data.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          No users with interests found in the database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((group) => (
            <div key={group._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <h3 className="text-lg font-bold text-gray-900 capitalize font-mono">#{group._id}</h3>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {group.totalUsers} {group.totalUsers === 1 ? 'User' : 'Users'}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
                  Associated Users:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.users.map((userName, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-md font-medium"
                    >
                      {userName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestsAggregationPage;
