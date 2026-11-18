import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { Compass, Plus, Calendar, Edit3, Trash2, User, ArrowRight } from 'lucide-react';

const PublicPostsPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create Post
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', content: '' });
  const [createLoading, setCreateLoading] = useState(false);

  // Edit Post
  const [editModal, setEditModal] = useState({ open: false, post: null });
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [editLoading, setEditLoading] = useState(false);

  // Delete Post
  const [deleteModal, setDeleteModal] = useState({ open: false, post: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/posts?page=${page}&limit=10`);
      setPosts(res.data.data || []);
      setPagination(res.data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch public posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.content.trim()) return;
    setCreateLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/posts', createForm);
      setSuccess('Post published to community feed.');
      setCreateModalOpen(false);
      setCreateForm({ title: '', content: '' });
      fetchPosts(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModal.post) return;
    setEditLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/posts/${editModal.post._id}`, editForm);
      setSuccess('Post updated.');
      setEditModal({ open: false, post: null });
      fetchPosts(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.post) return;
    setDeleteLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/posts/${deleteModal.post._id}`);
      setSuccess('Post deleted.');
      setDeleteModal({ open: false, post: null });
      fetchPosts(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
      setDeleteModal({ open: false, post: null });
    } finally {
      setDeleteLoading(false);
    }
  };

  const canModify = (post) => {
    if (!isAuthenticated || !user) return false;
    if (isAdmin) return true;
    const authorId = post.userId?._id || post.userId;
    return authorId?.toString() === user._id?.toString();
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 py-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
              Public Discussion
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Community Posts
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Public developer discussions, architectural tutorials, and technical insights.
            </p>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Post</span>
            </button>
          ) : (
            <span className="text-xs text-zinc-400 font-mono">Sign in to publish posts</span>
          )}
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner text="Loading feed..." />
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-2xs">
              <EmptyState
                title="Feed is quiet"
                description="Be the first engineer to publish a post to the community feed."
                actionText={isAuthenticated ? "Create Post" : null}
                onAction={() => setCreateModalOpen(true)}
              />
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <h2 className="text-lg font-bold text-zinc-900 tracking-tight">{post.title}</h2>
                    <div className="inline-flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-100/80 px-2.5 py-1 rounded-md font-medium">
                      <User className="w-3 h-3 text-zinc-400" />
                      <span>{post.userId?.name || 'Anonymous'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-600 whitespace-pre-line leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex justify-between items-center text-xs font-mono text-zinc-400 border-t border-zinc-100 pt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>

                    {canModify(post) && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditModal({ open: true, post });
                            setEditForm({ title: post.title, content: post.content });
                          }}
                          className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 font-sans text-xs font-semibold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, post })}
                          className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 font-sans text-xs font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}

              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden mt-6">
                <Pagination pagination={pagination} onPageChange={(p) => setCurrentPage(p)} />
              </div>
            </>
          )}
        </div>

        {/* Create Post Modal */}
        <Modal
          isOpen={createModalOpen}
          title="Create Community Post"
          confirmText="Publish Post"
          confirmVariant="primary"
          loading={createLoading}
          onClose={() => setCreateModalOpen(false)}
          onConfirm={handleCreateSubmit}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Post Title</label>
              <input
                type="text"
                required
                maxLength={200}
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="e.g. Architecting High-Performance MongoDB Aggregations"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Post Content</label>
              <textarea
                required
                rows={6}
                value={createForm.content}
                onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                placeholder="Share your thoughts or technical guidelines..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </form>
        </Modal>

        {/* Edit Post Modal */}
        <Modal
          isOpen={editModal.open}
          title="Edit Community Post"
          confirmText="Update Post"
          confirmVariant="primary"
          loading={editLoading}
          onClose={() => setEditModal({ open: false, post: null })}
          onConfirm={handleEditSubmit}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Post Title</label>
              <input
                type="text"
                required
                maxLength={200}
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Post Content</label>
              <textarea
                required
                rows={6}
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </form>
        </Modal>

        {/* Delete Post Modal */}
        <Modal
          isOpen={deleteModal.open}
          title="Delete Post"
          confirmText="Delete Post"
          confirmVariant="danger"
          loading={deleteLoading}
          onClose={() => setDeleteModal({ open: false, post: null })}
          onConfirm={handleDeleteConfirm}
        >
          <p className="text-sm text-zinc-700">
            Are you sure you want to delete <strong>"{deleteModal.post?.title}"</strong>?
          </p>
        </Modal>
      </main>
    </div>
  );
};

export default PublicPostsPage;
