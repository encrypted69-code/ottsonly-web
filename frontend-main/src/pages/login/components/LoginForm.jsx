import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { authAPI } from '../../../services/api';

const LoginForm = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!identifier?.trim()) {
      newErrors.identifier = 'Email is required';
    } else {
      const isEmail = identifier?.includes('@');
      if (!isEmail) {
        newErrors.identifier = 'Please enter a valid email address';
      }
    }

    if (!password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call user login API with email and password
      const response = await authAPI.login({ email: identifier, password });
      
      // Store tokens and user data
      localStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      localStorage.setItem('user', JSON.stringify(response.user));
      
      onSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      onError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">
          Login to access your OTT subscriptions
        </p>
      </div>
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email address"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e?.target?.value);
            if (errors?.identifier) {
              setErrors(prev => ({ ...prev, identifier: '' }));
            }
          }}
          error={errors?.identifier}
          required
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e?.target?.value);
                if (errors?.password) {
                  setErrors(prev => ({ ...prev, password: '' }));
                }
              }}
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
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="ShieldCheck" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Secure Login</p>
              <p className="text-xs text-muted-foreground">
                Your data is encrypted and protected with industry-standard security.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="left"
      >
        Login
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">New to OTTSONLY?</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={() => navigate('/registration')}
        iconName="UserPlus"
        iconPosition="left"
      >
        Create New Account
      </Button>
    </form>
  );
};

export default LoginForm;