import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/endpoints';
import { Search, ShieldAlert, Check, X, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected user for detailed view modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => adminApi.getUsers(),
  });

  const users = usersData?.data?.data || [];

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => adminApi.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast.success(`User status updated to ${variables.status}`);
    },
    onError: () => toast.error('Failed to update user status.'),
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: (id: number) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast.success('User account deleted.');
    },
    onError: () => toast.error('Failed to delete user.'),
  });

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete user ${name}? This action cannot be undone.`)) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">User Accounts</h2>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Access control and verification</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Option Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-slate-800/60 bg-slate-900/40 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-mono tracking-widest animate-pulse">
            LOADING USERS RECORDS...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm font-mono tracking-wider">
            NO USERS MATCHING SPECIFIED CRITERIA
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono tracking-wider text-slate-400 uppercase bg-slate-950/40">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300 text-xs">
                {currentUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{u.fullName}</td>
                    <td className="px-6 py-4 font-mono">{u.email}</td>
                    <td className="px-6 py-4 text-slate-400">{u.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE' || !u.status ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-blue-500/30 hover:bg-blue-500/10 text-blue-400 transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        
                        {u.status === 'DEACTIVATED' ? (
                          <button
                            onClick={() => updateStatus({ id: u.id, status: 'ACTIVE' })}
                            className="p-1.5 rounded-lg border border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                            title="Activate Account"
                          >
                            <Check size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus({ id: u.id, status: 'DEACTIVATED' })}
                            className="p-1.5 rounded-lg border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 text-red-400 transition-colors"
                            title="Deactivate Account"
                          >
                            <X size={14} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(u.id, u.fullName)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-slate-800 bg-slate-900/60 rounded-lg text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            PREV
          </button>
          <span className="text-xs font-mono text-slate-500 px-3">
            PAGE {currentPage} OF {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-slate-800 bg-slate-900/60 rounded-lg text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            NEXT
          </button>
        </div>
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-xl relative"
            >
              <h3 className="font-heading font-bold text-lg mb-4 text-white">User Details Profile</h3>
              
              <div className="space-y-3.5 text-sm">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">Full Name</span>
                  <span className="font-semibold text-white">{selectedUser.fullName}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">Email Address</span>
                  <span className="font-mono">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">Phone Number</span>
                  <span>{selectedUser.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">Home/Service Address</span>
                  <span className="text-slate-300 leading-relaxed block">{selectedUser.address || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">Account Role</span>
                  <span className="text-emerald-400 font-semibold">{selectedUser.role}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">Registrant Timestamp</span>
                  <span className="text-slate-400">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
