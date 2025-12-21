// Code will be added manually
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ProfileInformation = ({ user, onUpdate, toast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      onUpdate(formData);
      setIsEditing(false);
      setIsLoading(false);
      toast?.success('Profile updated successfully');
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      username: user?.username || '',
      phoneNumber: user?.phoneNumber || ''
    });
    setErrors({});
    setIsEditing(false);
  };
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
            <p className="text-sm text-muted-foreground">Manage your personal details</p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            iconName="Edit2"
            iconPosition="left"
          >
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Profile Picture */}
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Profile Avatar</p>
            <p className="text-xs text-muted-foreground">Your avatar is auto-generated from your name</p>
          </div>
        </div>

        {/* User ID & Creation Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">User ID</p>
            <p className="text-sm font-mono font-medium text-foreground">{user?.userId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account Created</p>
            <p className="text-sm font-medium text-foreground">{user?.createdAt}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            disabled={!isEditing || isLoading}
            required
          />

          <Input
            label="Username"
            name="username"
            value={formData.username}
            disabled
            helperText="Username cannot be changed"
          />

          <Input
            label="Email ID"
            value={user?.email}
            disabled
            helperText="Email address from registration"
          />

          <Input
            label="Phone Number"
            value={user?.phoneNumber}
            disabled
            helperText="Phone number from registration"
          />
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button
              variant="default"
              onClick={handleSave}
              loading={isLoading}
              iconName="Check"
              iconPosition="left"
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInformation;
