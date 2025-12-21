import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../../../components/ui/Dialog";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import AppIcon from "../../../components/AppIcon";

const UserDetailModal = ({ isOpen, onClose, user, onWalletAction }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [walletAmount, setWalletAmount] = useState("");

  if (!user) return null;

  const tabs = [
    { id: "profile", label: "Profile Info", icon: "User" },
    { id: "wallet", label: "Wallet & Balance", icon: "Wallet" },
    { id: "purchases", label: "Purchase History", icon: "ShoppingCart" },
    { id: "transactions", label: "Transactions", icon: "Receipt" },
    { id: "referrals", label: "Referrals", icon: "Users" }
  ];

  const handleWalletAction = (type) => {
    if (!walletAmount) {
      alert("Please enter an amount");
      return;
    }
    onWalletAction({
      userId: user.userId,
      type,
      amount: parseFloat(walletAmount)
    });
    setWalletAmount("");
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>User Details - {user.fullName}</DialogTitle>
      </DialogHeader>

      <DialogContent className="max-h-[70vh] overflow-y-auto">
        {/* Tabs */}
        <div className="flex space-x-1 border-b border-border mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AppIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Info Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="text-sm font-medium text-foreground">{user.userId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium text-foreground">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="text-sm font-medium text-foreground">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Referral Code</p>
                <p className="text-sm font-medium text-foreground">{user.referralCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Referred By</p>
                <p className="text-sm font-medium text-foreground">{user.referredBy || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  user.status === 'active' ? 'bg-green-500/10 text-green-500' :
                  user.status === 'blocked' ? 'bg-red-500/10 text-red-500' :
                  'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {user.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="text-sm font-medium text-foreground">{user.registrationDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === "wallet" && (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Current Wallet Balance</p>
              <p className="text-2xl font-bold text-foreground">₹{user.walletBalance}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Balance */}
              <div className="border border-green-500/20 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-foreground flex items-center space-x-2">
                  <AppIcon name="Plus" className="w-4 h-4 text-green-500" />
                  <span>Add Balance</span>
                </h4>
                <Input
                  type="number"
                  label="Amount"
                  placeholder="Enter amount"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                />
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleWalletAction("credit")}
                >
                  Add Balance
                </Button>
              </div>

              {/* Deduct Balance */}
              <div className="border border-red-500/20 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-foreground flex items-center space-x-2">
                  <AppIcon name="Minus" className="w-4 h-4 text-red-500" />
                  <span>Deduct Balance</span>
                </h4>
                <Input
                  type="number"
                  label="Amount"
                  placeholder="Enter amount"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                />
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleWalletAction("debit")}
                >
                  Deduct Balance
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Purchase History Tab */}
        {activeTab === "purchases" && (
          <div className="space-y-4">
            {user.purchases?.length > 0 ? (
              <div className="space-y-3">
                {user.purchases.map((purchase) => (
                  <div key={purchase.orderId} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{purchase.platform}</p>
                        <p className="text-sm text-muted-foreground">{purchase.planName}</p>
                        <p className="text-xs text-muted-foreground mt-1">Order: {purchase.orderId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{purchase.price}</p>
                        <p className="text-xs text-muted-foreground">{purchase.date}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          purchase.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {purchase.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No purchase history</p>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="space-y-4">
            {user.transactions?.length > 0 ? (
              <div className="space-y-3">
                {user.transactions.map((txn) => (
                  <div key={txn.transactionId} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{txn.type}</p>
                        <p className="text-sm text-muted-foreground">{txn.method}</p>
                        <p className="text-xs text-muted-foreground mt-1">TXN: {txn.transactionId}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${txn.type.includes('Credit') ? 'text-green-500' : 'text-red-500'}`}>
                          {txn.type.includes('Credit') ? '+' : '-'}₹{txn.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">{txn.date}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          txn.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No transaction history</p>
            )}
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === "referrals" && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-2xl font-bold text-foreground">{user.totalReferrals}</p>
            </div>
            {user.referrals?.length > 0 ? (
              <div className="space-y-3">
                {user.referrals.map((referral, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{referral.name}</p>
                      <p className="text-sm text-muted-foreground">{referral.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-500">+₹{referral.earning}</p>
                      <p className="text-xs text-muted-foreground">{referral.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No referrals yet</p>
            )}
          </div>
        )}
      </DialogContent>

      <div className="flex items-center justify-end space-x-2 p-6 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Dialog>
  );
};

export default UserDetailModal;
