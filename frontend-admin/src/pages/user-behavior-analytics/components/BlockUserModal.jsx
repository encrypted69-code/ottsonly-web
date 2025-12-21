import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "../../../components/ui/Dialog";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const BlockUserModal = ({ isOpen, onClose, user, onConfirm }) => {
  const [reason, setReason] = useState("");
  
  if (!user) return null;

  const isBlocked = user.status === "blocked";

  const handleConfirm = () => {
    onConfirm(user.userId, reason);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{isBlocked ? "Unblock User" : "Block User"}</DialogTitle>
      </DialogHeader>

      <DialogContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {isBlocked 
              ? `Are you sure you want to unblock ${user.fullName}? They will regain access to their account.`
              : `Are you sure you want to block ${user.fullName}? They will lose access to their account.`
            }
          </p>
          
          <Input
            label="Reason (Required)"
            placeholder={isBlocked ? "Reason for unblocking" : "Reason for blocking"}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant={isBlocked ? "default" : "destructive"}
          onClick={handleConfirm}
          disabled={!reason}
        >
          {isBlocked ? "Unblock User" : "Block User"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default BlockUserModal;
