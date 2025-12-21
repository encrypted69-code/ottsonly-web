import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import AppIcon from "../../../components/AppIcon";

const UserTable = ({ users, onViewUser, onBlockUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("registrationDate");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "walletBalance") return b.walletBalance - a.walletBalance;
    if (sortBy === "registrationDate") return new Date(b.registrationDate) - new Date(a.registrationDate);
    if (sortBy === "totalReferrals") return b.totalReferrals - a.totalReferrals;
    return 0;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-green-500/10 text-green-500 border-green-500/20",
      blocked: "bg-red-500/10 text-red-500 border-red-500/20",
      suspended: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    };
    return statusStyles[status.toLowerCase()] || statusStyles.active;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by ID, Email, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="suspended">Suspended</option>
          </Select>
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="registrationDate">Registration Date</option>
            <option value="walletBalance">Wallet Balance</option>
            <option value="totalReferrals">Total Referrals</option>
          </Select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Referrals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Wallet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.totalReferrals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">₹{user.walletBalance}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewUser(user)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="View Details"
                      >
                        <AppIcon name="Eye" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onBlockUser(user)}
                        className={`${user.status === 'blocked' ? 'text-green-500' : 'text-red-500'} hover:opacity-80 transition-opacity`}
                        title={user.status === 'blocked' ? 'Unblock' : 'Block'}
                      >
                        <AppIcon name={user.status === 'blocked' ? 'Unlock' : 'Lock'} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-foreground px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
