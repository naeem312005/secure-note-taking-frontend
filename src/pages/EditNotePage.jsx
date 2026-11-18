import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

const EditNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/notes/${id}`);
        setTitle(res.data.data.title || '');
        setContent(res.data.data.content || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load note details.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.put(`/notes/${id}`, { title, content });
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update note.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <LoadingSpinner text="Loading note..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
          <p className="text-sm text-gray-500">Update your encrypted note content</p>
        </div>
        <Link to="/notes" className="text-sm text-gray-600 hover:text-gray-900">
          &larr; Back to Notes
        </Link>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note Title
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note Content
            </label>
            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <Link
              to="/notes"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : 'Update Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNotePage;
