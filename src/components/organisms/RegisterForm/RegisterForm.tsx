import React, { useState } from 'react';\nimport axios from 'axios';\nimport { ENDPOINTS } from '../../../constants/api';
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

  const [error, setError] = useState<string>('');\n  const [isLoading, setIsLoading] = useState<boolean>(false);\n  const [success, setSuccess] = useState<boolean>(false);\n\n  const handleFormSubmit = async () => {
    try {\n      setIsLoading(true);\n      setError('');\n      setSuccess(false);
      const response = await axios.post(ENDPOINTS.REGISTER, {\n        nombre: values.nombre,\n        email: values.correo,\n        password: values.password,\n        telefono: values.telefono,\n        region: values.region,\n        comuna: values.comuna,\n        role: 'CLIENT',\n      });\n\n      if (response.status === 201 || response.status === 200) {\n        setSuccess(true);\n        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');\n        // Limpiar formulario\n        Object.keys(values).forEach(key => {\n          handleChange({ target: { name: key, value: '' } } as any);\n        });\n      }\n    } catch (err) {\n      if (axios.isAxiosError(err) && err.response) {\n        setError(err.response.data.message || 'Error al registrarse. Por favor, intenta nuevamente.');\n      } else {\n        setError('Error desconocido al registrarse.');\n      }\n    } finally {\n      setIsLoading(false);
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
        {error && <div className="alert alert-danger">{error}</div>}\n        {success && <div className="alert alert-success">¡Registro exitoso!</div>}\n        <Button type="submit" disabled={isLoading}>{isLoading ? 'Registrando...' : 'Registrarse'}</Button>
      </form>
    </section>
  );
};

export default RegisterForm;