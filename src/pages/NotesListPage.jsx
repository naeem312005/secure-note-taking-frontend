import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { Plus, Search, FileText, Clock, Edit3, Trash2, Calendar } from 'lucide-react';

const NotesListPage = () => {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, noteId: null, noteTitle: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchNotes = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/notes?page=${page}&limit=10`);
      setNotes(res.data.data || []);
      setPagination(res.data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(currentPage);
  }, [currentPage]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.noteId) return;
    setDeleting(true);
    try {
      await api.delete(`/notes/${deleteModal.noteId}`);
      setDeleteModal({ open: false, noteId: null, noteTitle: '' });
      fetchNotes(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note');
      setDeleteModal({ open: false, noteId: null, noteTitle: '' });
    } finally {
      setDeleting(false);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
              Vault Storage
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              My Private Notes
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Encrypted notes indexed for high-concurrency retrieval and instant sorting.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/notes/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Note</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter notes by title or content..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200/80 rounded-xl text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all shadow-2xs"
          />
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
          {loading ? (
            <LoadingSpinner text="Decrypting notes..." />
          ) : filteredNotes.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title={searchQuery ? 'No matching notes' : 'Vault is empty'}
                description={
                  searchQuery
                    ? `No notes match "${searchQuery}". Try a different keyword.`
                    : 'Start writing your first secure note to organize your thoughts.'
                }
                actionText={searchQuery ? 'Clear Filter' : 'Create Note'}
                actionLink={searchQuery ? null : '/notes/create'}
                onAction={searchQuery ? () => setSearchQuery('') : null}
              />
            </div>
          ) : (
            <>
              <div className="divide-y divide-zinc-100">
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    className="p-6 hover:bg-zinc-50/70 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                  >
                    <div className="max-w-4xl">
                      <h2 className="text-base font-bold text-zinc-900 tracking-tight mb-1.5">
                        {note.title}
                      </h2>
                      <p className="text-sm text-zinc-600 whitespace-pre-line line-clamp-3 leading-relaxed">
                        {note.content}
                      </p>
                      <div className="text-xs font-mono text-zinc-400 mt-3 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <Link
                        to={`/notes/edit/${note._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ open: true, noteId: note._id, noteTitle: note.title })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 bg-white border border-rose-200/70 rounded-lg hover:bg-rose-50 transition-colors shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                pagination={pagination}
                onPageChange={(newPage) => setCurrentPage(newPage)}
              />
            </>
          )}
        </div>

        <Modal
          isOpen={deleteModal.open}
          title="Delete Note"
          confirmText="Delete"
          confirmVariant="danger"
          loading={deleting}
          onClose={() => setDeleteModal({ open: false, noteId: null, noteTitle: '' })}
          onConfirm={handleDeleteConfirm}
        >
          <p className="text-sm text-zinc-700">
            Are you sure you want to permanently delete <strong>"{deleteModal.noteTitle}"</strong>?
          </p>
        </Modal>
      </main>
    </div>
  );
};

export default NotesListPage;
