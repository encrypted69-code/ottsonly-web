import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import CredentialsGrid from './components/CredentialsGrid';
import AddCredentialsModal from './components/AddCredentialsModal';
import EditCredentialsModal from './components/EditCredentialsModal';
import CredentialsSearch from './components/CredentialsSearch';

const OTTCredentialsDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [credentials, setCredentials] = useState([
    {
      id: 'cred_001',
      platform: 'Netflix',
      username: 'admin@netflix.com',
      password: '••••••••',
      apiKey: 'nflx_api_key_••••',
      lastUpdated: '2025-12-10',
      connectionStatus: 'active',
      encryptionStatus: 'enabled',
      accessLevel: 'admin'
    },
    {
      id: 'cred_002',
      platform: 'Amazon Prime',
      username: 'prime@admin.com',
      password: '••••••••',
      apiKey: 'amzn_api_key_••••',
      lastUpdated: '2025-12-12',
      connectionStatus: 'active',
      encryptionStatus: 'enabled',
      accessLevel: 'admin'
    },
    {
      id: 'cred_003',
      platform: 'Disney+',
      username: 'disney@admin.com',
      password: '••••••••',
      apiKey: 'dsny_api_key_••••',
      lastUpdated: '2025-12-14',
      connectionStatus: 'active',
      encryptionStatus: 'enabled',
      accessLevel: 'admin'
    },
    {
      id: 'cred_004',
      platform: 'HBO Max',
      username: 'hbo@admin.com',
      password: '••••••••',
      apiKey: 'hbo_api_key_••••',
      lastUpdated: '2025-12-08',
      connectionStatus: 'inactive',
      encryptionStatus: 'enabled',
      accessLevel: 'standard'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleAddCredential = (credentialData) => {
    const newCredential = {
      id: `cred_${Date.now()}`,
      ...credentialData,
      lastUpdated: new Date()?.toISOString()?.split('T')?.[0],
      connectionStatus: 'active',
      encryptionStatus: 'enabled'
    };
    setCredentials([...credentials, newCredential]);
    setShowAddModal(false);
  };

  const handleEditCredential = (credentialData) => {
    setCredentials(credentials?.map(c => 
      c?.id === selectedCredential?.id 
        ? { ...c, ...credentialData, lastUpdated: new Date()?.toISOString()?.split('T')?.[0] }
        : c
    ));
    setShowEditModal(false);
    setSelectedCredential(null);
  };

  const handleDeleteCredential = (credId) => {
    setCredentials(credentials?.filter(c => c?.id !== credId));
  };

  const handleTestConnection = (credId) => {
    setCredentials(credentials?.map(c => 
      c?.id === credId 
        ? { ...c, connectionStatus: c?.connectionStatus === 'active' ? 'testing' : 'active' }
        : c
    ));
    
    setTimeout(() => {
      setCredentials(prev => prev?.map(c => 
        c?.id === credId && c?.connectionStatus === 'testing'
          ? { ...c, connectionStatus: 'active' }
          : c
      ));
    }, 2000);
  };

  const filteredCredentials = credentials?.filter(c => 
    c?.platform?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    c?.username?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading credentials database...</p>
        </div>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">OTT Credentials Database</h1>
                <p className="text-muted-foreground">
                  Secure repository for OTT platform authentication credentials
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Credentials</span>
              </button>
            </div>
          </div>

          <CredentialsSearch 
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />

          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 shadow-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Platforms</p>
                  <p className="text-2xl font-bold text-foreground">{credentials?.length}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 shadow-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Connections</p>
                  <p className="text-2xl font-bold text-success">
                    {credentials?.filter(c => c?.connectionStatus === 'active')?.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 shadow-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Encrypted</p>
                  <p className="text-2xl font-bold text-primary">
                    {credentials?.filter(c => c?.encryptionStatus === 'enabled')?.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 shadow-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-sm font-bold text-foreground">
                    {new Date()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <CredentialsGrid 
            credentials={filteredCredentials}
            onEdit={(credential) => {
              setSelectedCredential(credential);
              setShowEditModal(true);
            }}
            onDelete={handleDeleteCredential}
            onTestConnection={handleTestConnection}
          />
        </div>
      </main>

      {showAddModal && (
        <AddCredentialsModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCredential}
        />
      )}

      {showEditModal && selectedCredential && (
        <EditCredentialsModal 
          credential={selectedCredential}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCredential(null);
          }}
          onSave={handleEditCredential}
        />
      )}
    </div>
  );
};

export default OTTCredentialsDatabase;