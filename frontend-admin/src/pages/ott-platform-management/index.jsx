import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import OTTPlatformGrid from './components/OTTPlatformGrid';
import AddOTTModal from './components/AddOTTModal';
import EditOTTModal from './components/EditOTTModal';
import PlanManagementPanel from './components/PlanManagementPanel';

const OTTPlatformManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platforms, setPlatforms] = useState([
    {
      id: 'ott_001',
      name: 'Netflix',
      logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&h=200&fit=crop',
      status: 'active',
      totalPlans: 3,
      totalUsers: 8945,
      plans: [
        { id: 'plan_001', name: 'Basic', price: 199, duration: '1 Month', features: ['720p', '1 Screen'] },
        { id: 'plan_002', name: 'Standard', price: 499, duration: '1 Month', features: ['1080p', '2 Screens'] },
        { id: 'plan_003', name: 'Premium', price: 649, duration: '1 Month', features: ['4K', '4 Screens'] }
      ]
    },
    {
      id: 'ott_002',
      name: 'Amazon Prime',
      logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
      status: 'active',
      totalPlans: 2,
      totalUsers: 7215,
      plans: [
        { id: 'plan_004', name: 'Monthly', price: 179, duration: '1 Month', features: ['1080p', 'Unlimited Screens'] },
        { id: 'plan_005', name: 'Yearly', price: 1499, duration: '12 Months', features: ['1080p', 'Unlimited Screens', 'Free Delivery'] }
      ]
    },
    {
      id: 'ott_003',
      name: 'Disney+',
      logo: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=200&h=200&fit=crop',
      status: 'active',
      totalPlans: 2,
      totalUsers: 4968,
      plans: [
        { id: 'plan_006', name: 'Mobile', price: 149, duration: '1 Month', features: ['720p', '1 Mobile'] },
        { id: 'plan_007', name: 'Premium', price: 299, duration: '1 Month', features: ['4K', '4 Screens'] }
      ]
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleAddOTT = (ottData) => {
    const newOTT = {
      id: `ott_${Date.now()}`,
      ...ottData,
      totalPlans: 0,
      totalUsers: 0,
      plans: []
    };
    setPlatforms([...platforms, newOTT]);
    setShowAddModal(false);
  };

  const handleEditOTT = (ottData) => {
    setPlatforms(platforms?.map(p => 
      p?.id === selectedPlatform?.id ? { ...p, ...ottData } : p
    ));
    setShowEditModal(false);
    setSelectedPlatform(null);
  };

  const handleRemoveOTT = (ottId) => {
    setPlatforms(platforms?.filter(p => p?.id !== ottId));
  };

  const handleAddPlan = (platformId, planData) => {
    setPlatforms(platforms?.map(p => {
      if (p?.id === platformId) {
        const newPlan = { id: `plan_${Date.now()}`, ...planData };
        return {
          ...p,
          plans: [...(p?.plans || []), newPlan],
          totalPlans: (p?.totalPlans || 0) + 1
        };
      }
      return p;
    }));
  };

  const handleEditPlan = (platformId, planId, planData) => {
    setPlatforms(platforms?.map(p => {
      if (p?.id === platformId) {
        return {
          ...p,
          plans: p?.plans?.map(plan => 
            plan?.id === planId ? { ...plan, ...planData } : plan
          )
        };
      }
      return p;
    }));
  };

  const handleRemovePlan = (platformId, planId) => {
    setPlatforms(platforms?.map(p => {
      if (p?.id === platformId) {
        return {
          ...p,
          plans: p?.plans?.filter(plan => plan?.id !== planId),
          totalPlans: p?.totalPlans - 1
        };
      }
      return p;
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading OTT platforms...</p>
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
                <h1 className="text-3xl font-bold text-foreground mb-2">OTT Platform Management</h1>
                <p className="text-muted-foreground">
                  Manage streaming platforms and subscription plans
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add OTT Platform</span>
              </button>
            </div>
          </div>

          <OTTPlatformGrid 
            platforms={platforms}
            onEdit={(platform) => {
              setSelectedPlatform(platform);
              setShowEditModal(true);
            }}
            onRemove={handleRemoveOTT}
          />

          <div className="mt-8">
            <PlanManagementPanel 
              platforms={platforms}
              onAddPlan={handleAddPlan}
              onEditPlan={handleEditPlan}
              onRemovePlan={handleRemovePlan}
            />
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddOTTModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddOTT}
        />
      )}

      {showEditModal && selectedPlatform && (
        <EditOTTModal 
          platform={selectedPlatform}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPlatform(null);
          }}
          onSave={handleEditOTT}
        />
      )}
    </div>
  );
};

export default OTTPlatformManagement;