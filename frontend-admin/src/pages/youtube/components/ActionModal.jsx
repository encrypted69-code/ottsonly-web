import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "../../../components/ui/Dialog";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const ActionModal = ({ isOpen, onClose, request, action, onConfirm }) => {
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  
  if (!request) return null;

  const handleConfirm = () => {
    if (action === "undo" && !reason) {
      alert("Please provide a reason for undo");
      return;
    }
    onConfirm(request.requestId, action === "done" ? note : reason);
    setNote("");
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>
          {action === "done" ? "Mark Request as Done" : "Undo Request"}
        </DialogTitle>
      </DialogHeader>

      <DialogContent>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Request ID:</span>
              <span className="text-sm font-medium text-foreground">{request.requestId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Username:</span>
              <span className="text-sm font-medium text-foreground">{request.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">YouTube Email:</span>
              <span className="text-sm font-medium text-foreground">{request.youtubeEmail}</span>
            </div>
          </div>

          {action === "done" ? (
            <>
              <p className="text-sm text-muted-foreground">
                Mark this YouTube email request as completed. This will notify the user.
              </p>
              <Input
                label="Admin Note (Optional)"
                placeholder="Add any notes about this completion"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-destructive">
                This will revert the request back to Pending status. Please provide a reason.
              </p>
              <Input
                label="Reason for Undo (Required)"
                placeholder="Why are you undoing this request?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </>
          )}
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant={action === "done" ? "default" : "destructive"}
          onClick={handleConfirm}
        >
          {action === "done" ? "Mark as Done" : "Confirm Undo"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ActionModal;
