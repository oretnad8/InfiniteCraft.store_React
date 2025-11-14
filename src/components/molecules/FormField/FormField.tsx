import React from 'react';
import Input from '../../atoms/Input/Input';
import './FormField.css';

interface FormFieldProps {
  label: string;
  type: string;
  id: string;
  name: string; // <-- AÑADIDO
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, type, id, name, value, onChange, required }) => {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <Input type={type} id={id} name={name} value={value} onChange={onChange} required={required} />
    </div>
  );
};

export default FormField;