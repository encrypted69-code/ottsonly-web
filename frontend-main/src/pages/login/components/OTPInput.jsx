import React, { useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, value, onChange, disabled }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs?.current?.[0]) {
      inputRefs?.current?.[0]?.focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const val = e?.target?.value;
    if (!/^\d*$/?.test(val)) return;

    const newOTP = value?.split('');
    newOTP[index] = val?.slice(-1);
    onChange(newOTP?.join(''));

    if (val && index < length - 1) {
      inputRefs?.current?.[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e?.key === 'Backspace' && !value?.[index] && index > 0) {
      inputRefs?.current?.[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e?.preventDefault();
    const pastedData = e?.clipboardData?.getData('text')?.slice(0, length);
    if (!/^\d+$/?.test(pastedData)) return;

    onChange(pastedData?.padEnd(length, ''));
    const nextIndex = Math.min(pastedData?.length, length - 1);
    inputRefs?.current?.[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length })?.map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value?.[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-14 text-center text-xl font-semibold
            bg-background border-2 rounded-lg
            transition-standard
            ${value?.[index] 
              ? 'border-primary text-foreground' 
              : 'border-border text-muted-foreground'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          `}
        />
      ))}
    </div>
  );
};

export default OTPInput;