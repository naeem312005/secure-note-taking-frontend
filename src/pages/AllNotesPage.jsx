import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import AdminSubNav from '../components/AdminSubNav';

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
    <div>
      <AdminSubNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">All System Notes</h1>
          <p className="text-sm text-gray-500 mt-1">
            System-wide note inspector. Query execution is optimized by index <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono font-bold">{"{ createdAt: -1 }"}</code>
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {loading ? (
            <LoadingSpinner text="Fetching all system notes..." />
          ) : notes.length === 0 ? (
            <div className="p-8">
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
                      <div className="text-xs bg-purple-50 text-purple-800 px-3 py-1 rounded-lg flex items-center space-x-1.5 font-medium">
                        <span className="font-bold">Author:</span>
                        <span>{note.userId?.name || 'Unknown'}</span>
                        <span className="text-purple-400">({note.userId?.email || 'N/A'})</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3 mb-3">{note.content}</p>

                    <div className="text-[11px] text-gray-400 flex items-center space-x-4 font-mono">
                      <span>Note ID: {note._id}</span>
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
    </div>
  );
};

export default AllNotesPage;
