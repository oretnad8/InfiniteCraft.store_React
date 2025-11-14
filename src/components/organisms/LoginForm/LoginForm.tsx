import React, { useState } from 'react';
import Button from '../../atoms/Button/Button';
import FormField from '../../molecules/FormField/FormField';
import useForm from '../../../hooks/useForm';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { values, handleChange, handleSubmit } = useForm({
    correo: '',
    password: '',
  });
  
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleFormSubmit = () => {
    const { correo, password } = values;

    if (correo === 'admin@8craftstore.cl' && password === '123456') {
      console.log('Admin login successful');
      setError('');
      navigate('/admin');
    } else {
      console.log('Login failed: ', values);
      setError('Credenciales incorrectas. Intente nuevamente.');
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
        <Button type="submit">Iniciar Sesión</Button>
      </form>
    </section>
  );
};

export default LoginForm;