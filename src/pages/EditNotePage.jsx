import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Save, FileText } from 'lucide-react';

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
      <div className="min-h-screen bg-zinc-50/50 flex items-center justify-center">
        <LoadingSpinner text="Retrieving note..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 py-8">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/notes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Notes</span>
          </Link>
          <span className="text-xs font-mono text-zinc-400">ID: {id}</span>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
            <FileText className="w-5 h-5 text-zinc-400" />
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Edit Note</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">Title</label>
              <input
                type="text"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">Content</label>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-mono leading-relaxed transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
              <Link
                to="/notes"
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg shadow-xs disabled:opacity-50 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Update Note'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditNotePage;
