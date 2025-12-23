// Code will be added manually
import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    referralCode: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/?.test(formData?.phone?.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      // Clean up the data before submitting
      const cleanedData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone.trim(),
      };
      
      // Only include referralCode if it has a value
      if (formData.referralCode && formData.referralCode.trim()) {
        cleanedData.referralCode = formData.referralCode.trim();
      }
      
      onSubmit(cleanedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleChange}
          error={errors?.fullName}
          required
          disabled={isLoading}
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={handleChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="Enter your 10-digit phone number"
          value={formData?.phone}
          onChange={handleChange}
          error={errors?.phone}
          required
          disabled={isLoading}
          maxLength={10}
        />

        <Input
          label="Referral Code"
          type="text"
          name="referralCode"
          placeholder="Enter referral code (optional)"
          value={formData?.referralCode}
          onChange={handleChange}
          error={errors?.referralCode}
          disabled={isLoading}
          maxLength={15}
        />
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
      >
        Continue to Verification
      </Button>
    </form>
  );
};

export default RegistrationForm;