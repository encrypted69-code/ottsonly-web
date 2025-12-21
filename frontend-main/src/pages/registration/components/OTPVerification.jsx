// Code will be added manually
import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OTPVerification = ({ phone, email, onVerify, isLoading }) => {
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (passwordData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordData?.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData?.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData?.password !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validatePassword()) {
      onVerify(passwordData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={passwordData?.password}
              onChange={handleChange}
              error={errors?.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Lock" size={16} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">Must be 8+ characters with uppercase, lowercase & number</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={passwordData?.confirmPassword}
              onChange={handleChange}
              error={errors?.confirmPassword}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="ShieldCheck" size={16} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">Please enter the same password again</span>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
      >
        Create Account
      </Button>
    </form>
  );
};

export default OTPVerification;