import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { Plus, FileText, Compass, Clock, Edit3, Trash2, ShieldCheck, Hash, ArrowRight } from 'lucide-react';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, noteId: null, noteTitle: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/notes?page=1&limit=5');
      setNotes(res.data.data || []);
      setTotalNotes(res.data.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.noteId) return;
    setDeleting(true);
    try {
      await api.delete(`/notes/${deleteModal.noteId}`);
      setDeleteModal({ open: false, noteId: null, noteTitle: '' });
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note');
      setDeleteModal({ open: false, noteId: null, noteTitle: '' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-medium text-zinc-400">Personal Workspace</span>
              <span className="text-zinc-300">&bull;</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                {user?.role}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Welcome back, {user?.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 max-w-xl">
              Encrypted note-taking environment protected with role-based access controls and B-tree compound indexing.
            </p>

            {user?.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-zinc-100">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mr-1">
                  Tags:
                </span>
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-zinc-50 border border-zinc-200/60 text-zinc-700 text-xs px-2.5 py-0.5 rounded-md font-mono"
                  >
                    <Hash className="w-3 h-3 text-zinc-400" />
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/notes/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Note</span>
            </Link>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider">Total Notes</span>
              <FileText className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 tracking-tight font-mono">
              {totalNotes}
            </div>
            <div className="mt-2 text-xs text-zinc-400 flex items-center gap-1">
              <span>Indexed with</span>
              <code className="text-zinc-600 font-mono text-[11px]">{"{ userId, createdAt }"}</code>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider">Access Scope</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Isolated Vault</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              Only authenticated owner can decrypt notes
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider">Public Channel</span>
              <Compass className="w-4 h-4 text-zinc-400" />
            </div>
            <Link
              to="/posts"
              className="text-sm font-semibold text-zinc-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Explore Community Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="mt-2 text-xs text-zinc-400">
              Publish and browse community posts
            </div>
          </div>
        </div>

        {/* Recent Notes Section */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Recent Notes</h2>
            </div>
            <Link
              to="/notes"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>View All ({totalNotes})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading recent notes..." />
          ) : notes.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Your vault is empty"
                description="Create your first encrypted private note to start organizing your thoughts."
                actionText="Create Note"
                actionLink="/notes/create"
              />
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="p-6 hover:bg-zinc-50/70 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="max-w-3xl">
                    <h3 className="text-base font-bold text-zinc-900 tracking-tight mb-1">
                      {note.title}
                    </h3>
                    <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>
                    <div className="text-xs font-mono text-zinc-400 mt-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
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
          )}
        </div>

        {/* Delete Confirmation Modal */}
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
          <p className="mt-2 text-xs text-zinc-400">
            This action removes the record from the MongoDB collection and cannot be recovered.
          </p>
        </Modal>
      </main>
    </div>
  );
};

export default UserDashboardPage;
