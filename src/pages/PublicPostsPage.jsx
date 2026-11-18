import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

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
      setSuccess('Post published successfully to the community feed!');
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
      setSuccess('Post updated successfully.');
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
      setSuccess('Post deleted successfully.');
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Posts</h1>
          <p className="text-sm text-gray-500">
            Public feed visible to everyone. Posts are stored in a separate Posts collection and indexed for fast retrieval.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            + Create Public Post
          </button>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading public posts..." />
        ) : posts.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No posts published yet"
              description="Be the first developer to publish a public post!"
              actionText={isAuthenticated ? "Create Post" : null}
              onAction={() => setCreateModalOpen(true)}
            />
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {posts.map((post) => (
                <article key={post._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold text-gray-900">{post.title}</h2>
                    <div className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded flex items-center space-x-1.5">
                      <span className="font-semibold text-gray-900">By:</span>
                      <span>{post.userId?.name || 'Anonymous'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-line mb-4">{post.content}</p>

                  <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-50 pt-3">
                    <span>Published: {new Date(post.createdAt).toLocaleDateString()}</span>

                    {canModify(post) && (
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setEditModal({ open: true, post });
                            setEditForm({ title: post.title, content: post.content });
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, post })}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <Pagination pagination={pagination} onPageChange={(p) => setCurrentPage(p)} />
          </>
        )}
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={createModalOpen}
        title="Publish Public Post"
        confirmText="Publish"
        confirmVariant="primary"
        loading={createLoading}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreateSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              maxLength={200}
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="e.g. Laravel Tutorial"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
            <textarea
              required
              rows={6}
              value={createForm.content}
              onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
              placeholder="Share details, tutorials, or architecture tips..."
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
        </form>
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        isOpen={editModal.open}
        title="Edit Post"
        confirmText="Save Changes"
        confirmVariant="primary"
        loading={editLoading}
        onClose={() => setEditModal({ open: false, post: null })}
        onConfirm={handleEditSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              maxLength={200}
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
            <textarea
              required
              rows={6}
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Post Modal */}
      <Modal
        isOpen={deleteModal.open}
        title="Delete Post"
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onClose={() => setDeleteModal({ open: false, post: null })}
        onConfirm={handleDeleteConfirm}
      >
        <p>Are you sure you want to permanently delete post <strong>"{deleteModal.post?.title}"</strong>?</p>
      </Modal>
    </div>
  );
};

export default PublicPostsPage;
