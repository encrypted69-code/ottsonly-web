import React from "react";
import Button from "../../../components/ui/Button";

const PlatformCard = ({ platform, logo, logoAlt, description, onEdit }) => {
  return (
    <div className="bg-card rounded-lg border border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.15)] p-4 flex items-center justify-between hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:border-green-500/50 hover:scale-[1.01] transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-background border border-border flex items-center justify-center overflow-hidden">
          <img 
            src={logo} 
            alt={logoAlt} 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground uppercase">{platform}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      
      <div>
        <Button 
          variant="default"
          className="px-6"
          onClick={onEdit}
        >
          EDIT
        </Button>
      </div>
    </div>
  );
};

export default PlatformCard;
