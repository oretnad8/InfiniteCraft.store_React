import { useState } from 'react';
// Cambia la importación 'ChangeEvent' para que sea de solo tipo
import type { ChangeEvent } from 'react';

const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, callback: () => void) => {
    e.preventDefault();
    callback();
  };

  return {
    values,
    handleChange,
    handleSubmit,
  };
};

export default useForm;