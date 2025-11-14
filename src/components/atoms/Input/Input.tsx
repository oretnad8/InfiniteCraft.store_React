import React from 'react';
import './Input.css';

interface InputProps {
  type: string;
  id: string;
  name: string; // <-- AÑADIDO
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ type, id, name, value, onChange, required }) => {
  return <input type={type} id={id} name={name} value={value} onChange={onChange} required={required} />;
};

export default Input;