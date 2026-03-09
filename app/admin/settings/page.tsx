'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  Users, 
  Lock, 
  Activity, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  ipAddress: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function AdminManagementPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'password' | 'users' | 'logs'>('password');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [usersError, setUsersError] = useState('');
  const [usersSuccess, setUsersSuccess] = useState('');
  
  // Logs state
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsFilter, setLogsFilter] = useState<string>('');
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const url = logsFilter 
        ? `/api/admin/logs?action=${logsFilter}`
        : '/api/admin/logs';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error || 'Failed to update password');
      }
    } catch (error) {
      setPasswordError('Failed to update password');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsersError('');
    setUsersSuccess('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName,
          password: newUserPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsersSuccess('Admin user created successfully!');
        setShowAddUserModal(false);
        setNewUserEmail('');
        setNewUserName('');
        setNewUserPassword('');
        fetchUsers();
      } else {
        setUsersError(data.error || 'Failed to create user');
      }
    } catch (error) {
      setUsersError('Failed to create user');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setUsersError('');
    setUsersSuccess('');

    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setUsersSuccess('Admin user deleted successfully!');
        setUserToDelete(null);
        fetchUsers();
      } else {
        setUsersError(data.error || 'Failed to delete user');
      }
    } catch (error) {
      setUsersError('Failed to delete user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      LOGIN: 'bg-blue-500/20 text-blue-400',
      CREATE_ADMIN: 'bg-green-500/20 text-green-400',
      DELETE_ADMIN: 'bg-red-500/20 text-red-400',
      UPDATE_PASSWORD: 'bg-yellow-500/20 text-yellow-400',
      CREATE_ITEM: 'bg-purple-500/20 text-purple-400',
      UPDATE_ITEM: 'bg-orange-500/20 text-orange-400',
      DELETE_ITEM: 'bg-pink-500/20 text-pink-400',
    };
    return colors[action] || 'bg-gray-500/20 text-gray-400';
  };

  const tabs = [
    { id: 'password', label: 'Update Password', icon: <Lock size={20} /> },
    { id: 'users', label: 'Manage Admins', icon: <Users size={20} /> },
    { id: 'logs', label: 'Activity Logs', icon: <Activity size={20} /> },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-white mb-2">Admin Management</h1>
        <p className="text-gray-400">Manage admin users, passwords, and view activity logs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-[#D4AF37]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Password Update Tab */}
      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-2xl p-6">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">Update Your Password</h2>
            
            {passwordError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-400">{passwordError}</p>
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-start gap-2">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-green-400">{passwordSuccess}</p>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Confirm New Password</label>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Manage Admins Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-white">Admin Users</h2>
              <Button onClick={() => setShowAddUserModal(true)}>
                <Plus size={18} className="mr-2" />
                Add Admin
              </Button>
            </div>

            {usersError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-400">{usersError}</p>
              </div>
            )}

            {usersSuccess && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-start gap-2">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-green-400">{usersSuccess}</p>
              </div>
            )}

            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div>
                    <h3 className="text-white font-medium">{user.name}</h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Created: {formatDate(user.createdAt)}
                    </p>
                  </div>
                  {session?.user?.id !== user.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserToDelete(user)}
                      className="text-red-400 hover:text-red-300 border-red-500/50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove
                    </Button>
                  )}
                  {session?.user?.id === user.id && (
                    <span className="text-sm text-gray-500 italic">Current User</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'logs' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-white">Admin Activity Logs</h2>
              <div className="flex gap-2">
                <select
                  value={logsFilter}
                  onChange={(e) => {
                    setLogsFilter(e.target.value);
                    fetchLogs();
                  }}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">All Actions</option>
                  <option value="LOGIN">Login</option>
                  <option value="CREATE_ADMIN">Create Admin</option>
                  <option value="DELETE_ADMIN">Delete Admin</option>
                  <option value="UPDATE_PASSWORD">Update Password</option>
                  <option value="CREATE_ITEM">Create Item</option>
                  <option value="UPDATE_ITEM">Update Item</option>
                  <option value="DELETE_ITEM">Delete Item</option>
                </select>
                <Button variant="outline" onClick={fetchLogs}>
                  Refresh
                </Button>
              </div>
            </div>

            {logsLoading ? (
              <div className="text-center py-8 text-gray-400">Loading logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No activity logs found</div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-400 text-sm">{log.user.name} ({log.user.email})</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Clock size={14} />
                        {formatDate(log.createdAt)}
                      </div>
                    </div>
                    <p className="text-white mb-1">{log.description}</p>
                    {log.ipAddress && (
                      <p className="text-gray-500 text-xs">IP: {log.ipAddress}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New Admin User"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <Input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <Input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <Input
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1">
              Create Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddUserModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete Admin User"
        message={`Are you sure you want to delete ${userToDelete?.name} (${userToDelete?.email})? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}
