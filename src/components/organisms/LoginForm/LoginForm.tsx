import React from 'react';
import Button from '../../atoms/Button/Button';
import FormField from '../../molecules/FormField/FormField';
import useForm from '../../../hooks/useForm';

const LoginForm: React.FC = () => {
  const { values, handleChange, handleSubmit } = useForm({
    correo: '',
    password: '',
  });

  const handleFormSubmit = () => {
    // Lógica de validación y login
    console.log(values);
  };

  return (
    <section id="login" className="seccion">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={e => handleSubmit(e, handleFormSubmit)}>
        <FormField
          label="Correo:"
          type="email"
          id="login-correo"
          value={values.correo}
          onChange={handleChange}
          required
        />
        <FormField
          label="Contraseña:"
          type="password"
          id="login-password"
          value={values.password}
          onChange={handleChange}
          required
        />
        <Button type="submit">Iniciar Sesión</Button>
      </form>
    </section>
  );
};

export default LoginForm;