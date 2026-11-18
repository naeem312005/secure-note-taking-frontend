import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import AdminSubNav from '../components/AdminSubNav';
import { FileText, Calendar, Clock, User, Hash } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-50/50">
      <AdminSubNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
              Audit & Inspection
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              System-Wide Notes
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Global inventory of notes across all accounts, supported by the reverse-chronological index <code className="font-mono text-xs text-zinc-700 bg-zinc-100 px-1 py-0.5 rounded">{"{ createdAt: -1 }"}</code>.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-2xs">
            Admin View
          </span>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
          {loading ? (
            <LoadingSpinner text="Retrieving notes index..." />
          ) : notes.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No notes in vault"
                description="No users have authored any notes yet."
              />
            </div>
          ) : (
            <>
              <div className="divide-y divide-zinc-100">
                {notes.map((note) => (
                  <div key={note._id} className="p-6 hover:bg-zinc-50/60 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <h2 className="text-base font-bold text-zinc-900 tracking-tight">{note.title}</h2>
                      <div className="text-xs bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
                        <User className="w-3 h-3 text-zinc-400" />
                        <span className="font-semibold text-zinc-900">{note.userId?.name || 'Unknown'}</span>
                        <span className="text-zinc-400 font-mono text-[11px]">({note.userId?.email || 'N/A'})</span>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-600 whitespace-pre-line line-clamp-3 mb-3 leading-relaxed">
                      {note.content}
                    </p>

                    <div className="text-xs font-mono text-zinc-400 flex items-center gap-4">
                      <span>ID: {note._id}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination pagination={pagination} onPageChange={(p) => setCurrentPage(p)} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllNotesPage;
