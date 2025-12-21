import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AppIcon from '../../components/AppIcon';
import { credentialsAPI } from '../../services/api';

const IDP = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showUsedModal, setShowUsedModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  // Form states
  const [formData, setFormData] = useState({
    platform: '',
    username: '',
    password: '',
    notes: ''
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const response = await credentialsAPI.getAll();
      setCredentials(response.credentials || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ platform: '', username: '', password: '', notes: '' });
    setShowAddModal(true);
  };

  const handleEdit = (credential) => {
    setSelectedCredential(credential);
    setFormData({
      platform: credential.platform,
      username: credential.username,
      password: credential.password,
      notes: credential.notes || ''
    });
    setShowEditModal(true);
  };

  const handleViewUsed = (credential) => {
    setSelectedCredential(credential);
    setShowUsedModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this credential?')) return;
    
    try {
      await credentialsAPI.delete(id);
      await fetchCredentials();
    } catch (error) {
      console.error('Error deleting credential:', error);
      alert('Failed to delete credential');
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await credentialsAPI.create(formData);
      setShowAddModal(false);
      await fetchCredentials();
    } catch (error) {
      console.error('Error creating credential:', error);
      alert('Failed to create credential');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await credentialsAPI.update(selectedCredential.id, formData);
      setShowEditModal(false);
      await fetchCredentials();
    } catch (error) {
      console.error('Error updating credential:', error);
      alert('Failed to update credential');
    }
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) {
      alert('Please enter credentials in the format: Platform|Username|Password|Notes');
      return;
    }

    const lines = bulkText.split('\n');
    let successCount = 0;
    let failCount = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      const parts = trimmedLine.split('|');
      if (parts.length < 3) {
        failCount++;
        continue;
      }

      try {
        await credentialsAPI.create({
          platform: parts[0].trim(),
          username: parts[1].trim(),
          password: parts[2].trim(),
          notes: parts[3]?.trim() || ''
        });
        successCount++;
      } catch (error) {
        console.error('Error importing credential:', error);
        failCount++;
      }
    }

    alert(`Import complete!\nSuccess: ${successCount}\nFailed: ${failCount}`);
    setShowBulkModal(false);
    setBulkText('');
    await fetchCredentials();
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL credentials? This action cannot be undone!')) {
      return;
    }

    if (!confirm('This will permanently delete all credentials from the database. Are you absolutely sure?')) {
      return;
    }

    try {
      // Delete all credentials one by one
      for (const cred of credentials) {
        await credentialsAPI.delete(cred.id);
      }
      alert('All credentials have been deleted');
      await fetchCredentials();
    } catch (error) {
      console.error('Error clearing credentials:', error);
      alert('Failed to clear credentials');
    }
  };

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = selectedPlatform === 'all' || 
      cred.platform.toUpperCase() === selectedPlatform.toUpperCase();
    
    return matchesSearch && matchesPlatform;
  });

  // Get unique platforms for the selector
  const availablePlatforms = [...new Set(credentials.map(cred => cred.platform.toUpperCase()))].sort();

  // Group credentials by platform
  const groupedCredentials = filteredCredentials.reduce((acc, cred) => {
    const platform = cred.platform.toUpperCase();
    if (!acc[platform]) {
      acc[platform] = [];
    }
    acc[platform].push(cred);
    return acc;
  }, {});

  const getPlatformIcon = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('netflix')) return 'Film';
    if (platformLower.includes('prime') || platformLower.includes('amazon')) return 'Play';
    if (platformLower.includes('youtube')) return 'Youtube';
    if (platformLower.includes('pornhub')) return 'Video';
    if (platformLower.includes('hotstar')) return 'Star';
    if (platformLower.includes('zee')) return 'Tv';
    return 'Lock';
  };

  const getPlatformColor = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('netflix')) return 'bg-red-500';
    if (platformLower.includes('prime') || platformLower.includes('amazon')) return 'bg-blue-500';
    if (platformLower.includes('youtube')) return 'bg-red-600';
    if (platformLower.includes('pornhub')) return 'bg-orange-500';
    if (platformLower.includes('hotstar')) return 'bg-indigo-500';
    if (platformLower.includes('zee')) return 'bg-purple-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-24">
        <div className="p-6 lg:p-8">
          <Breadcrumb />
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">IDP - Credentials Manager</h1>
                <p className="text-muted-foreground">
                  Manage ID and passwords for Netflix, Prime, Pornhub and other OTT platforms
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Credentials</p>
                    <p className="text-2xl font-bold text-foreground">{credentials.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <AppIcon name="Database" className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Available</p>
                    <p className="text-2xl font-bold text-success">{credentials.filter(c => !c.is_used).length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <AppIcon name="CheckCircle" className="w-6 h-6 text-success" />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">In Use</p>
                    <p className="text-2xl font-bold text-warning">{credentials.filter(c => c.is_used).length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <AppIcon name="Users" className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Platforms</p>
                    <p className="text-2xl font-bold text-foreground">{availablePlatforms.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <AppIcon name="Layers" className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAdd}
              >
                Add Credential
              </Button>
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={() => setShowBulkModal(true)}
              >
                Bulk Import
              </Button>
              {credentials.length > 0 && (
                <Button
                  variant="destructive"
                  iconName="Trash2"
                  iconPosition="left"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-card rounded-lg border border-border shadow-card p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Search</label>
                <Input
                  placeholder="Search by platform or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  iconName="Search"
                />
              </div>

              {/* Platform Filter */}
              {availablePlatforms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Filter by Platform</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedPlatform('all')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPlatform === 'all'
                          ? 'bg-primary text-white'
                          : 'bg-background text-foreground border border-border hover:border-primary'
                      }`}
                    >
                      All ({credentials.length})
                    </button>
                    {availablePlatforms.map((platform) => {
                      const count = credentials.filter(c => c.platform.toUpperCase() === platform).length;
                      const available = credentials.filter(c => c.platform.toUpperCase() === platform && !c.is_used).length;
                      return (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatform(platform)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            selectedPlatform === platform
                              ? `${getPlatformColor(platform)} text-white`
                              : 'bg-background text-foreground border border-border hover:border-primary'
                          }`}
                        >
                          <AppIcon name={getPlatformIcon(platform)} className="w-4 h-4" />
                          <span>{platform}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            selectedPlatform === platform
                              ? 'bg-white/20'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {available}/{count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Credentials by Platform */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading credentials...</p>
            </div>
          ) : filteredCredentials.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <AppIcon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium text-foreground mb-2">No credentials found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search' : 'Add your first credential to get started'}
              </p>
              {!searchQuery && (
                <Button variant="primary" onClick={handleAdd}>
                  Add First Credential
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedCredentials).map(([platform, creds]) => (
                <div key={platform} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                  {/* Platform Header */}
                  <div className={`${getPlatformColor(platform)} px-6 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <AppIcon name={getPlatformIcon(platform)} className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{platform}</h2>
                        <p className="text-xs text-white/80">
                          {creds.length} credential{creds.length !== 1 ? 's' : ''} • {creds.filter(c => !c.is_used).length} available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <AppIcon name="Check" className="w-4 h-4" />
                      <span>{creds.filter(c => c.is_active).length} active</span>
                    </div>
                  </div>

                  {/* Credentials Grid */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {creds.map((cred) => (
                      <div key={cred.id} className="bg-background rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${cred.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                              {cred.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {cred.is_used ? (
                              <button
                                onClick={() => handleViewUsed(cred)}
                                className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                              >
                                Used
                              </button>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                Available
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Username / Email</p>
                            <p className="text-sm font-mono text-foreground bg-card px-2 py-1.5 rounded border border-border truncate">
                              {cred.username}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Password</p>
                            <p className="text-sm font-mono text-foreground bg-card px-2 py-1.5 rounded border border-border">
                              {cred.password}
                            </p>
                          </div>
                          {cred.notes && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Notes</p>
                              <p className="text-xs text-foreground line-clamp-2">{cred.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            iconName="Edit2"
                            onClick={() => handleEdit(cred)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            fullWidth
                            iconName="Trash2"
                            onClick={() => handleDelete(cred.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-foreground/40 z-[250]" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 z-[251] flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Add New Credential</h2>
              <form onSubmit={handleSubmitAdd} className="space-y-4">
                <Input
                  label="Platform Name"
                  placeholder="e.g., Netflix, Prime, Pornhub"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  required
                />
                <Input
                  label="Username / Email"
                  placeholder="username@example.com"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Input
                  label="Password"
                  type="text"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Input
                  label="Notes (Optional)"
                  placeholder="Additional information"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" fullWidth onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" fullWidth>
                    Add Credential
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div className="fixed inset-0 bg-foreground/40 z-[250]" onClick={() => setShowEditModal(false)} />
          <div className="fixed inset-0 z-[251] flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Edit Credential</h2>
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <Input
                  label="Platform Name"
                  placeholder="e.g., Netflix, Prime, Pornhub"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  required
                />
                <Input
                  label="Username / Email"
                  placeholder="username@example.com"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Input
                  label="Password"
                  type="text"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Input
                  label="Notes (Optional)"
                  placeholder="Additional information"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" fullWidth onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" fullWidth>
                    Update Credential
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <>
          <div className="fixed inset-0 bg-foreground/40 z-[250]" onClick={() => setShowBulkModal(false)} />
          <div className="fixed inset-0 z-[251] flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">Bulk Import Credentials</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enter one credential per line in the format: <code className="bg-muted px-2 py-1 rounded">Platform|Username|Password|Notes</code>
              </p>
              
              <div className="bg-muted/50 border border-border rounded-lg p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-2">Example format:</p>
                <pre className="text-xs text-foreground font-mono">
Netflix|user1@example.com|pass123|Premium account{'\n'}
Prime|user2@example.com|pass456|Family plan{'\n'}
Pornhub|user3@example.com|pass789|Premium Plus
                </pre>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Paste Credentials (one per line)
                  </label>
                  <textarea
                    className="w-full h-64 px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Netflix|user1@example.com|pass123|Premium&#10;Prime|user2@example.com|pass456|Family plan&#10;Pornhub|user3@example.com|pass789|Premium"
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lines starting with # will be ignored as comments
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" fullWidth onClick={() => setShowBulkModal(false)}>
                    Cancel
                  </Button>
                  <Button type="button" variant="primary" fullWidth onClick={handleBulkImport}>
                    Import Credentials
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Used Details Modal */}
      {showUsedModal && selectedCredential && (
        <>
          <div className="fixed inset-0 bg-foreground/40 z-[250]" onClick={() => setShowUsedModal(false)} />
          <div className="fixed inset-0 z-[251] flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Credential Usage Details</h2>
                <button onClick={() => setShowUsedModal(false)} className="text-muted-foreground hover:text-foreground">
                  <AppIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Platform Credentials</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Platform</p>
                      <p className="text-sm font-semibold text-foreground">{selectedCredential.platform}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Username/Email</p>
                      <p className="text-sm font-mono text-foreground">{selectedCredential.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Password</p>
                      <p className="text-sm font-mono text-foreground">{selectedCredential.password}</p>
                    </div>
                  </div>
                </div>

                {selectedCredential.user_info ? (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AppIcon name="User" className="w-5 h-5 text-primary" />
                      <p className="text-sm font-semibold text-primary">Assigned To</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Customer Name</p>
                        <p className="text-sm font-semibold text-foreground">{selectedCredential.user_info.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm text-foreground">{selectedCredential.user_info.email}</p>
                      </div>
                      {selectedCredential.user_info.phone && (
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm text-foreground">{selectedCredential.user_info.phone}</p>
                        </div>
                      )}
                      {selectedCredential.used_at && (
                        <div>
                          <p className="text-xs text-muted-foreground">Assigned On</p>
                          <p className="text-sm text-foreground">
                            {new Date(selectedCredential.used_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <p className="text-sm text-warning">User information not available</p>
                  </div>
                )}

                <Button variant="outline" fullWidth onClick={() => setShowUsedModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IDP;
