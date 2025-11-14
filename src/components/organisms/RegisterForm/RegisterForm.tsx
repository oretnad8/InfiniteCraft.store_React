import React from 'react';
import Button from '../../atoms/Button/Button';
import FormField from '../../molecules/FormField/FormField';
import useForm from '../../../hooks/useForm';
import { regionesYComunas } from '../../../data/regions';

const RegisterForm: React.FC = () => {
  const { values, handleChange, handleSubmit } = useForm({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    region: '',
    comuna: '',
  });

  const handleFormSubmit = () => {
    // Lógica de validación y registro
    console.log(values);
  };

  return (
    <section id="registro" className="seccion">
      <h2>Registro de Usuario</h2>
      <form onSubmit={e => handleSubmit(e, handleFormSubmit)}>
        <FormField
          label="Nombre Completo:"
          type="text"
          id="nombre"
          name="nombre" // <-- AÑADIDO
          value={values.nombre}
          onChange={handleChange}
          required
        />
        <FormField
          label="Correo:"
          type="email"
          id="correo"
          name="correo" // <-- AÑADIDO
          value={values.correo}
          onChange={handleChange}
          required
        />
        <FormField
          label="Contraseña:"
          type="password"
          id="password"
          name="password" // <-- AÑADIDO
          value={values.password}
          onChange={handleChange}
          required
        />
        <FormField
          label="Teléfono (opcional):"
          type="tel"
          id="telefono"
          name="telefono" // <-- AÑADIDO
          value={values.telefono}
          onChange={handleChange}
        />
        <div>
          <label htmlFor="region">Región:</label>
          <select id="region" name="region" value={values.region} onChange={handleChange}>
            <option value="">Seleccione región</option>
            {Object.keys(regionesYComunas).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comuna">Comuna:</label>
          <select id="comuna" name="comuna" value={values.comuna} onChange={handleChange}>
            <option value="">Seleccione comuna</option>
            {values.region &&
              regionesYComunas[values.region as keyof typeof regionesYComunas].map(comuna => (
                <option key={comuna} value={comuna}>{comuna}</option>
              ))}
          </select>
        </div>
        <Button type="submit">Registrarse</Button>
      </form>
    </section>
  );
};

export default RegisterForm;