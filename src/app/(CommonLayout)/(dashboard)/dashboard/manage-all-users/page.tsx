"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion"; // Importing Framer Motion for animations
import { useDeleteusersMutation, useGetAllUsersQuery, useUpdateusersMutation } from "@/redux/api/userApi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'HR' | 'MARKETING_TEAM' | 'CUSTOMER_SERVICE_TEAM';
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  mobileNumber?: string;
  emailVerified?: boolean;
  profilePhoto?: string;
}

export default function ManageAllUsers() {
  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({});
  const [deleteUser] = useDeleteusersMutation();
  const [updateUser] = useUpdateusersMutation();

  // Tab and filter states
  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'users'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'BLOCKED' | 'DELETED'>('all');
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    role: string;
    status: string;
    mobileNumber?: string;
    emailVerified?: boolean;
  }>({
    name: "",
    email: "",
    role: "USER", 
    status: "ACTIVE", 
    mobileNumber: "",
    emailVerified: false,
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      refetch();
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUserId(user._id);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      mobileNumber: user.mobileNumber || "",
      emailVerified: user.emailVerified || false,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setEditFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      await updateUser({ id: editingUserId, usersData: editFormData });
      setEditingUserId(null);
      refetch();
    }
  };

  // Filter and pagination logic
  const filteredUsers = useMemo(() => {
    if (!data?.data) return [];
    
    const filtered = data.data.filter((user: User) => {
      // Tab filter
      if (activeTab === 'admin' && user.role !== 'ADMIN') return false;
      if (activeTab === 'users' && user.role !== 'USER') return false;
      
      // Search filter
      if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !user.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Status filter
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      
      // Email verification filter
      if (emailVerifiedFilter === 'verified' && !user.emailVerified) return false;
      if (emailVerifiedFilter === 'unverified' && user.emailVerified) return false;
      
      return true;
    });
    
    return filtered;
  }, [data?.data, activeTab, searchTerm, statusFilter, emailVerifiedFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (
    filterType: string, 
    value: string | 'all' | 'admin' | 'users' | 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'verified' | 'unverified'
  ) => {
    setCurrentPage(1);
    if (filterType === 'tab') setActiveTab(value as 'all' | 'admin' | 'users');
    if (filterType === 'search') setSearchTerm(value as string);
    if (filterType === 'status') setStatusFilter(value as 'all' | 'ACTIVE' | 'BLOCKED' | 'DELETED');
    if (filterType === 'emailVerified') setEmailVerifiedFilter(value as 'all' | 'verified' | 'unverified');
  };

  const getTabCounts = () => {
    if (!data?.data) return { all: 0, admin: 0, users: 0 };
    
    const all = data.data.length;
    const admin = data.data.filter((user: User) => user.role === 'ADMIN').length;
    const users = data.data.filter((user: User) => user.role === 'USER').length;
    
    return { all, admin, users };
  };

  const tabCounts = getTabCounts();

  if (isLoading) return <div className="text-center py-8 text-sm text-gray-600">Loading...</div>;
  if (isError) return <div className="text-center py-8 text-sm text-red-600">Failed to load users.</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900">Manage Users</h1>
        <Link
          href="/register"
          className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
        >
          Create New User
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => handleFilterChange('tab', 'all')}
          className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
            activeTab === 'all'
              ? 'bg-black text-white border-b-2 border-black'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          All Users ({tabCounts.all})
        </button>
        <button
          onClick={() => handleFilterChange('tab', 'admin')}
          className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
            activeTab === 'admin'
              ? 'bg-black text-white border-b-2 border-black'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          Admins ({tabCounts.admin})
        </button>
        <button
          onClick={() => handleFilterChange('tab', 'users')}
          className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
            activeTab === 'users'
              ? 'bg-black text-white border-b-2 border-black'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          Users ({tabCounts.users})
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-4 rounded mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Search Users</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>

          {/* Email Verification Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Verification</label>
            <select
              value={emailVerifiedFilter}
              onChange={(e) => handleFilterChange('emailVerified', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          {/* Items per page */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Items per page</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Results info */}
          <div className="flex items-end">
            <div className="text-xs text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </div>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-8 text-sm">
          {searchTerm || statusFilter !== 'all' || emailVerifiedFilter !== 'all' ? 'No users found matching your filters.' : 'No users found.'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white border border-gray-200 rounded">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="py-2 px-3 text-center text-xs font-medium">Profile</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Name</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Email</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Email Verified</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Role</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Status</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Mobile</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user: User) => (
                  <motion.tr
                    key={user._id}
                    className="text-center border-b border-gray-100 transition-all hover:bg-gray-50"
                    whileHover={{ scale: 1.00 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <td className="py-2 px-3">
                      {user.profilePhoto ? (
                        <Image
                          src={user.profilePhoto}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full mx-auto"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="py-2 px-3 text-sm text-gray-700">{user.email}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.emailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : user.status === 'BLOCKED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-700">{user.mobileNumber || "-"}</td>
                    <td className="py-2 px-3 space-x-1">
                      <button
                        className="bg-black text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 bg-white border border-gray-200 p-4 rounded">
              <div className="text-xs text-gray-600 mb-3 sm:mb-0">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  First
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    // If total pages is 5 or less, show all pages
                    pageNumber = i + 1;
                  } else {
                    // Calculate page number based on current page position
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(totalPages, startPage + 4);
                    const adjustedStartPage = Math.max(1, endPage - 4);
                    pageNumber = adjustedStartPage + i;
                  }
                  
                  // Only render if pageNumber is valid and within range
                  if (pageNumber >= 1 && pageNumber <= totalPages) {
                    return (
                      <button
                        key={`page-${pageNumber}`}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-2 py-1 text-xs border rounded ${
                          currentPage === pageNumber
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  return null;
                }).filter(Boolean)}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
                
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {editingUserId && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white border border-gray-200 p-6 rounded w-full max-w-md mx-4"
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
          >
            <h2 className="text-lg font-bold mb-4 text-gray-900">Edit User</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                  <option value="HR">HR</option>
                  <option value="MARKETING_TEAM">MARKETING TEAM</option>
                  <option value="CUSTOMER_SERVICE_TEAM">CUSTOMER SERVICE TEAM</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={editFormData.mobileNumber}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Email Verified</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="emailVerified"
                    checked={editFormData.emailVerified}
                    onChange={handleEditChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-xs text-gray-700">Email is verified</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => setEditingUserId(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors">
                  Update
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
