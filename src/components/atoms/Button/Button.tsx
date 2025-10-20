import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type = 'button' }) => {
  return (
    <button type={type} className={`custom-btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;