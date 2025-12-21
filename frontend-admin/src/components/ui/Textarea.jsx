import React from 'react';

const Textarea = ({ 
  value, 
  onChange, 
  placeholder = '', 
  rows = 4,
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth resize-none ${className}`}
      {...props}
    />
  );
};

export default Textarea;
