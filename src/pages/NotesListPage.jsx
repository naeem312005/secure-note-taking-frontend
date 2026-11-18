import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

const NotesListPage = () => {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <p className="text-sm text-gray-500">
            All your private notes, retrieved using the compound index <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{"{ userId: 1, createdAt: -1 }"}</code>
          </p>
        </div>

        <Link
          to="/notes/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          + Create New Note
        </Link>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching your notes..." />
        ) : notes.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No notes found"
              description="You have not created any notes yet. Click the button below to add your first note."
              actionText="Create Note"
              actionLink="/notes/create"
            />
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {notes.map((note) => (
                <div key={note._id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="max-w-4xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{note.title}</h2>
                    <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3">{note.content}</p>
                    <div className="text-xs text-gray-400 mt-3 flex items-center space-x-4">
                      <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
                      {note.updatedAt !== note.createdAt && (
                        <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
                      )}
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
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={deleting}
        onClose={() => setDeleteModal({ open: false, noteId: null, noteTitle: '' })}
        onConfirm={handleDeleteConfirm}
      >
        <p>Are you sure you want to delete <strong>"{deleteModal.noteTitle}"</strong>?</p>
      </Modal>
    </div>
  );
};

export default NotesListPage;
