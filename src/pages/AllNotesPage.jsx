import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

const AllNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllNotes = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/notes?page=${page}&limit=10`);
      setNotes(res.data.data || []);
      setPagination(res.data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch system notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotes(currentPage);
  }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Notes (Admin View)</h1>
        <p className="text-sm text-gray-500">
          Viewing all notes from all users across the system. Supported by MongoDB index <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{"{ createdAt: -1 }"}</code>
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching all system notes..." />
        ) : notes.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No notes in database"
              description="No notes have been created by any user in the system."
            />
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {notes.map((note) => (
                <div key={note._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <h2 className="text-base font-bold text-gray-900">{note.title}</h2>
                    <div className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded flex items-center space-x-1.5">
                      <span className="font-semibold text-gray-900">Author:</span>
                      <span>{note.userId?.name || 'Unknown'}</span>
                      <span className="text-gray-400">({note.userId?.email || 'N/A'})</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3 mb-3">{note.content}</p>

                  <div className="text-xs text-gray-400 flex items-center space-x-4">
                    <span>Note ID: <code className="font-mono text-gray-500">{note._id}</code></span>
                    <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <Pagination pagination={pagination} onPageChange={(p) => setCurrentPage(p)} />
          </>
        )}
      </div>
    </div>
  );
};

export default AllNotesPage;
