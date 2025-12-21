// Code will be added manually
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const YouTubePurchaseHistory = ({ toast, purchaseData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [gmailId, setGmailId] = useState(purchaseData?.gmailSubmitted || '');
  const [editedGmail, setEditedGmail] = useState('');
  const [error, setError] = useState('');
  const [editCount, setEditCount] = useState(purchaseData?.editCount || 0);

  // Use actual YouTube purchase data from props
  const youtubePurchase = purchaseData;

  // If no purchase data, don't render
  if (!youtubePurchase) {
    return null;
  }

  const validateGmail = (email) => {
    if (!email?.trim()) {
      return 'Gmail ID is required';
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid Gmail address (must end with @gmail.com)';
    }
    if (email === gmailId) {
      return 'New Gmail must be different from current Gmail';
    }
    return '';
  };

  const handleEditClick = () => {
    if (youtubePurchase.status === 'Added Successfully') {
      toast?.error('Cannot edit Gmail after successful addition');
      return;
    }
    if (editCount >= youtubePurchase.maxEdits) {
      toast?.error(`Maximum edit limit (${youtubePurchase.maxEdits}) reached`);
      return;
    }
    setEditedGmail(gmailId);
    setIsEditing(true);
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedGmail('');
    setError('');
  };

  const handleSaveGmail = () => {
    const validationError = validateGmail(editedGmail);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setGmailId(editedGmail);
      setEditCount(prev => prev + 1);
      setIsEditing(false);
      setEditedGmail('');
      setError('');
      toast?.success('Gmail updated successfully. Status changed to Pending.');
    }, 500);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending Addition': {
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20',
        icon: 'Clock'
      },
      'Added Successfully': {
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
        icon: 'CheckCircle2'
      }
    };

    const config = statusConfig[status] || statusConfig['Pending Addition'];

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bg} ${config.text} ${config.border}`}>
        <Icon name={config.icon} size={16} />
        <span className="text-sm font-medium">{status}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* YouTube Purchase Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-subtle">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
              <img 
                src="https://i.ibb.co/fdFBHghg/ytlogo.png" 
                alt="YouTube Premium logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{youtubePurchase.productName}</h3>
              <p className="text-sm text-muted-foreground">{youtubePurchase.planType}</p>
            </div>
          </div>
          {getStatusBadge(youtubePurchase.status)}
        </div>

        {/* Purchase Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Order ID</p>
            <p className="text-sm font-mono font-medium text-foreground">{youtubePurchase.orderId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Purchase Date</p>
            <p className="text-sm font-medium text-foreground">{youtubePurchase.purchaseDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Amount Paid</p>
            <p className="text-sm font-semibold text-primary">₹{youtubePurchase.amountPaid}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
            <p className="text-sm font-medium text-foreground">{youtubePurchase.paymentMethod}</p>
          </div>
          <div className="col-span-2 md:col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Subscription Status</p>
            <p className="text-sm font-medium text-foreground">{youtubePurchase.status}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6"></div>

        {/* Submitted Gmail Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Icon name="Mail" size={18} color="var(--color-primary)" />
              Submitted Gmail ID
            </h4>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                iconName="Edit2"
                iconPosition="left"
                disabled={youtubePurchase.status === 'Added Successfully' || editCount >= youtubePurchase.maxEdits}
              >
                Edit Gmail
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <Icon name="AtSign" size={20} color="var(--color-muted-foreground)" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{gmailId}</p>
                    <p className="text-xs text-muted-foreground">
                      {editCount < youtubePurchase.maxEdits 
                        ? `${youtubePurchase.maxEdits - editCount} edits remaining`
                        : 'No edits remaining'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-4">
              <Input
                label="New Gmail ID"
                type="email"
                placeholder="example@gmail.com"
                value={editedGmail}
                onChange={(e) => {
                  setEditedGmail(e?.target?.value);
                  if (error) setError('');
                }}
                error={error}
                required
              />
              
              <div className="bg-card border border-warning/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Icon name="AlertCircle" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground mb-1">Important Notes:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Must be a fresh Gmail (no family already joined)</li>
                      <li>• You can only edit {youtubePurchase.maxEdits} times</li>
                      <li>• Status will change back to "Pending Addition"</li>
                      <li>• Cannot edit after successful addition</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="default"
                  onClick={handleSaveGmail}
                  iconName="Check"
                  iconPosition="left"
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  iconName="X"
                  iconPosition="left"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Info Section */}
          {!isEditing && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {youtubePurchase.status === 'Added Successfully' 
                      ? 'You have been successfully added!' 
                      : 'Processing Your Request'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {youtubePurchase.status === 'Added Successfully'
                      ? 'Your Gmail has been added to the YouTube Family account. You can now enjoy YouTube Premium benefits.'
                      : 'Our team will review and add your Gmail to the family account within 24 hours. Check back for updates.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubePurchaseHistory;
