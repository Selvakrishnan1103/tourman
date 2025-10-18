
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`bg-primary border border-slate-600 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent text-text-primary ${className}`}
      {...props}
    />
  );
};

export default Input;
