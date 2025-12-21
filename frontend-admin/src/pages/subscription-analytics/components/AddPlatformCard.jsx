import React from "react";
import AppIcon from "../../../components/AppIcon";

const AddPlatformCard = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-lg border border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.15)] p-4 flex items-center justify-center space-x-3 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:border-green-500/50 hover:scale-[1.01] transition-all duration-200 cursor-pointer min-h-[88px]"
    >
      <AppIcon name="Plus" className="w-6 h-6 text-foreground" />
      <h3 className="text-lg font-bold text-foreground uppercase">Add Subscription</h3>
    </div>
  );
};

export default AddPlatformCard;
