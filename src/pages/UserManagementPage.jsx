import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import AdminSubNav from '../components/AdminSubNav';

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
      setSuccess('User created successfully by administrator.');
      setCreateModalOpen(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user', interests: '' });
      fetchUsers(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
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
      setSuccess('User details updated successfully.');
      setEditModal({ open: false, user: null });
      fetchUsers(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
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
      setSuccess('User and associated notes and posts were deleted.');
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
    <div>
      <AdminSubNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">User Management</h1>
            <p className="text-sm text-gray-500">
              Administrate registered accounts, modify roles, and inspect posts via MongoDB <code className="text-xs font-mono font-bold">$lookup</code>.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0"
          >
            + Add New User
          </button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {loading ? (
            <LoadingSpinner text="Loading users..." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Interests</th>
                      <th className="px-6 py-3.5">Registered</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {u.interests && u.interests.length > 0 ? (
                              u.interests.map((interest, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-mono">
                                  #{interest}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs italic">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <Link
                            to={`/admin/users/${u._id}/posts`}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Scenario 2: View user posts joined via $lookup"
                          >
                            $lookup Posts
                          </Link>
                          <button
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, user: u })}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            Delete
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
          title="Admin: Create User"
          confirmText="Create User"
          confirmVariant="primary"
          loading={createLoading}
          onClose={() => setCreateModalOpen(false)}
          onConfirm={handleCreateSubmit}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Address</label>
              <input
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Password (min 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Role</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="user">User (Standard Access)</option>
                <option value="admin">Admin (Full Administrative Access)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Interests (comma-separated)</label>
              <input
                type="text"
                value={createForm.interests}
                onChange={(e) => setCreateForm({ ...createForm, interests: e.target.value })}
                placeholder="e.g. coding, chess"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </form>
        </Modal>

        {/* Edit User Modal */}
        <Modal
          isOpen={editModal.open}
          title={`Edit User: ${editModal.user?.name}`}
          confirmText="Save Changes"
          confirmVariant="primary"
          loading={editLoading}
          onClose={() => setEditModal({ open: false, user: null })}
          onConfirm={handleEditSubmit}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Address</label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">New Password (optional)</label>
              <input
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="Leave blank to keep unchanged"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Interests (comma-separated)</label>
              <input
                type="text"
                value={editForm.interests}
                onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </form>
        </Modal>

        {/* Delete User Modal */}
        <Modal
          isOpen={deleteModal.open}
          title="Confirm User Deletion"
          confirmText="Permanently Delete"
          confirmVariant="danger"
          loading={deleteLoading}
          onClose={() => setDeleteModal({ open: false, user: null })}
          onConfirm={handleDeleteConfirm}
        >
          <p className="text-gray-800">
            Are you sure you want to delete user <strong>"{deleteModal.user?.name}"</strong> ({deleteModal.user?.email})?
          </p>
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
            <p className="font-bold">Administrative Safeguards:</p>
            <p>• Cannot delete your own account (accidental self-deletion prevented).</p>
            <p>• Cannot delete the last remaining active administrator.</p>
            <p>• Associated notes and posts will be removed.</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagementPage;
