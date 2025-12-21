import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "../../../components/ui/Dialog";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const EditPlatformModal = ({ isOpen, onClose, platform, onSave }) => {
  const [formData, setFormData] = useState({
    platform: platform?.platform || "",
    logo: platform?.logo || "",
    description: platform?.description || "",
    stocks: platform?.stocks || 0,
    price: platform?.price || 0
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...platform, ...formData });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Edit Platform Details</DialogTitle>
      </DialogHeader>
      
      <DialogContent>
        <div className="space-y-4">
          <Input
            label="Platform Name"
            value={formData.platform}
            onChange={(e) => handleChange("platform", e.target.value)}
            placeholder="Enter platform name"
            required
          />
          
          <Input
            label="Logo URL"
            value={formData.logo}
            onChange={(e) => handleChange("logo", e.target.value)}
            placeholder="Enter logo URL"
            required
          />
          
          <Input
            label="Plan Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter plan description"
            required
          />
          
          <Input
            label="Available Stocks"
            type="number"
            value={formData.stocks}
            onChange={(e) => handleChange("stocks", parseInt(e.target.value) || 0)}
            placeholder="Enter stock quantity"
            required
          />
          
          <Input
            label="Price (₹)"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", parseInt(e.target.value) || 0)}
            placeholder="Enter price"
            required
          />
        </div>
      </DialogContent>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          variant="default"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditPlatformModal;
