// Code will be added manually
import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useNavigate } from 'react-router-dom';

const TermsAgreement = ({ checked, onChange, error }) => {
  const navigate = useNavigate();

  const handleTermsClick = (e) => {
    e?.preventDefault();
    navigate('/terms-and-conditions');
  };

  const handlePrivacyClick = (e) => {
    e?.preventDefault();
    navigate('/privacy-policy');
  };

  return (
    <div className="space-y-2">
      <Checkbox
        checked={checked}
        onChange={onChange}
        error={error}
        label={
          <span className="text-sm text-foreground">
            I agree to the{' '}
            <button
              onClick={handleTermsClick}
              className="text-primary hover:underline font-medium"
            >
              Terms & Conditions
            </button>
            {' '}and{' '}
            <button
              onClick={handlePrivacyClick}
              className="text-primary hover:underline font-medium"
            >
              Privacy Policy
            </button>
          </span>
        }
      />
    </div>
  );
};

export default TermsAgreement;