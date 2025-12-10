import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type = 'button', disabled = false, style }) => {
  return (
    <button type={type} className={`custom-btn ${className}`} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
};

export default Button;