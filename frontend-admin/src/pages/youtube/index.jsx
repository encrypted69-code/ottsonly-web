import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import YouTubeRequestTable from './components/YouTubeRequestTable';
import ActionModal from './components/ActionModal';
import { youtubeAPI } from '../../services/api';

const YouTube = () => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch YouTube requests from API
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await youtubeAPI.getRequests();
      
      // Check if requests exist and is an array
      if (!data || !Array.isArray(data.requests)) {
        console.error('Invalid response format:', data);
        setRequests([]);
        return;
      }
      
      // Transform API data to match component format
      const transformedRequests = data.requests.map(req => ({
        requestId: req.id || req._id,
        username: req.username || 'Unknown',
        userId: req.user_id || '',
        registeredEmail: req.registered_email || '',
        youtubeEmail: req.youtube_email || '',
        requestDate: req.created_at ? new Date(req.created_at).toLocaleString() : 'N/A',
        status: req.status === 'done' ? 'Done' : 'Pending',
        requestMessage: req.admin_notes || '',
        platformName: req.platform_name || 'YouTube',
        planName: req.plan_name || 'Premium'
      }));
      
      setRequests(transformedRequests);
    } catch (err) {
      console.error('Error fetching YouTube requests:', err);
      setError(err.message || 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (userId) => {
    console.log("View user:", userId);
    // Navigate to user detail or show user info
  };

  const handleMarkDone = (request) => {
    setSelectedRequest(request);
    setActionType("done");
    setIsActionModalOpen(true);
  };

  const handleUndo = (request) => {
    setSelectedRequest(request);
    setActionType("undo");
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = async (requestId, noteOrReason) => {
    try {
      if (actionType === "done") {
        await youtubeAPI.markDone(requestId, noteOrReason);
      } else {
        await youtubeAPI.undo(requestId, noteOrReason);
      }
      
      // Refresh the requests list
      await fetchRequests();
      
      console.log(`Request ${requestId} ${actionType === "done" ? "marked as done" : "undone"}`);
      console.log(`Note/Reason: ${noteOrReason}`);
    } catch (err) {
      console.error('Error updating request:', err);
      alert(`Failed to ${actionType} request: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:ml-60 pt-24">
          <div className="p-6 lg:p-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading YouTube requests...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:ml-60 pt-24">
          <div className="p-6 lg:p-8">
            <div className="text-center py-12">
              <p className="text-red-500">Error: {error}</p>
              <button 
                onClick={fetchRequests}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-24">
        <div className="p-6 lg:p-8">
          <Breadcrumb />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">YouTube Mail Requests</h1>
            <p className="text-muted-foreground">
              Manage and process YouTube email access requests from users
            </p>
          </div>

          <YouTubeRequestTable 
            requests={requests}
            onViewUser={handleViewUser}
            onMarkDone={handleMarkDone}
            onUndo={handleUndo}
          />
        </div>
      </main>

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        request={selectedRequest}
        action={actionType}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default YouTube;
