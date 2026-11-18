import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import AdminSubNav from '../components/AdminSubNav';
import { Users, Plus, Edit3, Trash2, Layers, Shield, Key, AlertTriangle, Hash } from 'lucide-react';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create User Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user', interests: '' });
  const [createLoading, setCreateLoading] = useState(false);

  // Edit User Modal
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', role: 'user', interests: '' });
  const [editLoading, setEditLoading] = useState(false);

  // Delete User Modal
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=10`);
      setUsers(res.data.data || []);
      setPagination(res.data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');
    setSuccess('');

    const interests = createForm.interests
      .split(',')
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i.length > 0);

    try {
      await api.post('/admin/users', {
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role,
        interests
      });
      setSuccess('User account successfully provisioned.');
      setCreateModalOpen(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user', interests: '' });
      fetchUsers(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user account.');
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditModal = (user) => {
    setEditModal({ open: true, user });
    setEditForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      interests: (user.interests || []).join(', ')
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModal.user) return;
    setEditLoading(true);
    setError('');
    setSuccess('');

    const interests = editForm.interests
      .split(',')
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i.length > 0);

    const payload = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      interests
    };
    if (editForm.password.trim().length >= 6) {
      payload.password = editForm.password;
    }

    try {
      await api.put(`/admin/users/${editModal.user._id}`, payload);
      setSuccess('User profile updated successfully.');
      setEditModal({ open: false, user: null });
      fetchUsers(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user profile.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return;
    setDeleteLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/admin/users/${deleteModal.user._id}`);
      setSuccess('User account and associated documents removed.');
      setDeleteModal({ open: false, user: null });
      fetchUsers(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
      setDeleteModal({ open: false, user: null });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <AdminSubNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
              Directory & Roles
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              User Directory
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Manage authentication credentials, role assignments, and inspect joined authored posts.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add User</span>
          </button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
          {loading ? (
            <LoadingSpinner text="Loading directory records..." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
                  <thead className="bg-zinc-50/70 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Interests</th>
                      <th className="px-6 py-3.5">Created</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-zinc-900 leading-tight">{u.name}</div>
                          <div className="text-xs font-mono text-zinc-400">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              u.role === 'admin'
                                ? 'bg-zinc-900 text-emerald-400'
                                : 'bg-zinc-100 text-zinc-700'
                            }`}
                          >
                            {u.role === 'admin' && <Shield className="w-3 h-3" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {u.interests && u.interests.length > 0 ? (
                              u.interests.map((interest, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-0.5 bg-zinc-50 border border-zinc-200/60 text-zinc-700 text-xs px-2 py-0.5 rounded font-mono"
                                >
                                  <Hash className="w-2.5 h-2.5 text-zinc-400" />
                                  {interest}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-300 text-xs">&mdash;</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-zinc-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-1.5">
                          <Link
                            to={`/admin/users/${u._id}/posts`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
                            title="Inspect joined authored posts ($lookup)"
                          >
                            <span>$lookup Posts</span>
                          </Link>
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, user: u })}
                            className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination pagination={pagination} onPageChange={(p) => setCurrentPage(p)} />
            </>
          )}
        </div>

        {/* Create User Modal */}
        <Modal
          isOpen={createModalOpen}
          title="Create New User Account"
          confirmText="Provision User"
          confirmVariant="primary"
          loading={createLoading}
          onClose={() => setCreateModalOpen(false)}
          onConfirm={handleCreateSubmit}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Password (min 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Role Permission</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="user">User (Standard Access)</option>
                <option value="admin">Admin (System Access)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Interests (comma-separated)</label>
              <input
                type="text"
                value={createForm.interests}
                onChange={(e) => setCreateForm({ ...createForm, interests: e.target.value })}
                placeholder="e.g. coding, chess"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </form>
        </Modal>

        {/* Edit User Modal */}
        <Modal
          isOpen={editModal.open}
          title={`Edit User: ${editModal.user?.name}`}
          confirmText="Update Profile"
          confirmVariant="primary"
          loading={editLoading}
          onClose={() => setEditModal({ open: false, user: null })}
          onConfirm={handleEditSubmit}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Reset Password (leave empty to keep)</label>
              <input
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Role Assignment</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Interests (comma-separated)</label>
              <input
                type="text"
                value={editForm.interests}
                onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </form>
        </Modal>

        {/* Delete User Modal */}
        <Modal
          isOpen={deleteModal.open}
          title="Delete Account"
          confirmText="Delete Account"
          confirmVariant="danger"
          loading={deleteLoading}
          onClose={() => setDeleteModal({ open: false, user: null })}
          onConfirm={handleDeleteConfirm}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">
                Are you sure you want to delete {deleteModal.user?.name}?
              </p>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                This will permanently delete the account and all related notes and posts. Safeguards will reject self-deletion or deleting the last administrator.
              </p>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default UserManagementPage;
