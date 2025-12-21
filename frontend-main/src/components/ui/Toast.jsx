// Code will be added manually
import React, { useEffect, useState } from 'react';
import Icon from '../AppIcon';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success',
          text: 'text-success-foreground',
          icon: 'CheckCircle2',
          iconColor: 'var(--color-success-foreground)'
        };
      case 'error':
        return {
          bg: 'bg-error',
          text: 'text-error-foreground',
          icon: 'XCircle',
          iconColor: 'var(--color-error-foreground)'
        };
      case 'warning':
        return {
          bg: 'bg-warning',
          text: 'text-warning-foreground',
          icon: 'AlertTriangle',
          iconColor: 'var(--color-warning-foreground)'
        };
      default:
        return {
          bg: 'bg-card',
          text: 'text-card-foreground',
          icon: 'Info',
          iconColor: 'var(--color-primary)'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`
        ${styles?.bg} ${styles?.text}
        px-4 py-3 rounded-lg shadow-prominent
        flex items-center gap-3 min-w-[320px] max-w-md
        border ${type === 'info' ? 'border-border' : 'border-transparent'}
        ${isExiting ? 'animate-fade-out' : 'animate-slide-up'}
      `}
    >
      <Icon name={styles?.icon} size={20} color={styles?.iconColor} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="p-1 rounded hover:bg-black/10 transition-micro"
      >
        <Icon name="X" size={16} color={styles?.iconColor} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts?.map((toast) => (
          <div key={toast?.id} className="mb-2">
            <Toast
              message={toast?.message}
              type={toast?.type}
              duration={toast?.duration}
              onClose={() => removeToast(toast?.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export { Toast, ToastContainer };
export default Toast;