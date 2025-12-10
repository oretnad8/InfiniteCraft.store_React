import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../atoms/Button/Button';
import FormField from '../../molecules/FormField/FormField';
import useForm from '../../../hooks/useForm';


const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { values, handleChange, handleSubmit } = useForm({
    correo: '',
    password: '',
  });


  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = async () => {
    const { correo, password } = values;

    try {
      setIsLoading(true);
      await login(correo, password);
      setError('');
      // La redirección a /admin se manejará en el componente superior o en App.tsx
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al iniciar sesión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="login" className="seccion">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={e => handleSubmit(e, handleFormSubmit)}>
        <FormField
          label="Correo:"
          type="email"
          id="login-correo"
          name="correo" // <-- AÑADIDO
          value={values.correo}
          onChange={handleChange}
          required
        />
        <FormField
          label="Contraseña:"
          type="password"
          id="login-password"
          name="password" // <-- AÑADIDO
          value={values.password}
          onChange={handleChange}
          required
        />
        {error && <p style={{ color: '#e74c3c', marginTop: '10px' }}>{error}</p>}
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</Button>
      </form>
    </section>
  );
};

export default LoginForm;
