import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback({
    success: (message) => {
      console.log('✅ Success:', message);
      alert(message);
    },
    error: (message) => {
      console.error('❌ Error:', message);
      alert(message);
    },
    info: (message) => {
      console.log('ℹ️ Info:', message);
      alert(message);
    }
  }, []);

  return { toast, toasts };
};
