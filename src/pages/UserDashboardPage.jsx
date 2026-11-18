import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const UserDashboardPage = () => {
  const { user, logout } = useAuth();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Hero */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-blue-100 text-blue-800">
              {user?.role}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Secure personal dashboard. Manage and organize your private encrypted notes.
          </p>
          {user?.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-xs text-gray-500 font-medium">Interests:</span>
              {user.interests.map((interest, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-mono">
                  #{interest}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/notes/create"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            + Create Note
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Notes</div>
          <div className="text-3xl font-extrabold text-blue-600">{totalNotes}</div>
          <p className="text-xs text-gray-400 mt-2">Stored with compound index optimization</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Security Status</div>
          <div className="text-lg font-bold text-green-600 flex items-center space-x-1.5">
            <span>●</span>
            <span>JWT Authenticated</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Ownership enforced on all operations</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Public Posts</div>
          <Link to="/posts" className="text-lg font-semibold text-blue-600 hover:underline block">
            Explore Community Posts &rarr;
          </Link>
          <p className="text-xs text-gray-400 mt-2">Read and publish public developer posts</p>
        </div>
      </div>

      {/* Recent Notes Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Notes</h2>
          <Link to="/notes" className="text-sm font-medium text-blue-600 hover:underline">
            View All ({totalNotes}) &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading recent notes..." />
        ) : notes.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No notes yet"
              description="You haven't created any private notes yet. Start writing your first note!"
              actionText="Create Your First Note"
              actionLink="/notes/create"
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notes.map((note) => (
              <div key={note._id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="max-w-3xl">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{note.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    Created: {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Link
                    to={`/notes/edit/${note._id}`}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ open: true, noteId: note._id, noteTitle: note.title })}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50"
                  >
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
        title="Confirm Note Deletion"
        confirmText="Delete Note"
        confirmVariant="danger"
        loading={deleting}
        onClose={() => setDeleteModal({ open: false, noteId: null, noteTitle: '' })}
        onConfirm={handleDeleteConfirm}
      >
        <p>
          Are you sure you want to permanently delete the note: <strong>"{deleteModal.noteTitle}"</strong>?
        </p>
        <p className="mt-2 text-xs text-gray-500">This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default UserDashboardPage;
