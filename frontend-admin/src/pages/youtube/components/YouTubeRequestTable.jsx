import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import AppIcon from "../../../components/AppIcon";

const YouTubeRequestTable = ({ requests, onViewUser, onMarkDone, onUndo }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.registeredEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === "date") return new Date(b.requestDate) - new Date(a.requestDate);
    return 0;
  });

  // Pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = sortedRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(sortedRequests.length / requestsPerPage);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      done: "bg-green-500/10 text-green-500 border-green-500/20",
      undo: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return statusStyles[status.toLowerCase()] || statusStyles.pending;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by Request ID, Username, User ID, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="undo">Undo</option>
          </Select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Registered Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">YouTube Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-muted-foreground">
                      <AppIcon name="Inbox" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium mb-1">No YouTube requests found</p>
                      <p className="text-sm">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your filters' 
                          : 'YouTube email requests will appear here'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => (
                <tr key={request.requestId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{request.requestId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onViewUser(request.userId)}
                      className="text-sm text-primary hover:text-primary/80 font-medium underline"
                    >
                      {request.username}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{request.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{request.registeredEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{request.youtubeEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{request.requestDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      {request.status.toLowerCase() === "pending" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onMarkDone(request)}
                        >
                          <AppIcon name="Check" className="w-4 h-4 mr-1" />
                          Done
                        </Button>
                      )}
                      {request.status.toLowerCase() === "done" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onUndo(request)}
                        >
                          <AppIcon name="RotateCcw" className="w-4 h-4 mr-1" />
                          Undo
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedRequests.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstRequest + 1} to {Math.min(indexOfLastRequest, sortedRequests.length)} of {sortedRequests.length} requests
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
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeRequestTable;
