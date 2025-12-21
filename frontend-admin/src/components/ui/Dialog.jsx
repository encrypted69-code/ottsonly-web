import React from "react";
import { cn } from "../../utils/cn";

const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-10">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6 border-b border-border", className)}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className }) => {
  return (
    <h2 className={cn("text-lg font-semibold text-foreground", className)}>
      {children}
    </h2>
  );
};

const DialogContent = ({ children, className }) => {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
};

const DialogFooter = ({ children, className }) => {
  return (
    <div className={cn("flex items-center justify-end space-x-2 p-6 border-t border-border", className)}>
      {children}
    </div>
  );
};

export { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter };
