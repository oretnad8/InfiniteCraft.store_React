import React from 'react';
import Button from '../../atoms/Button/Button';
import FormField from '../../molecules/FormField/FormField';
import useForm from '../../../hooks/useForm';

const ContactForm: React.FC = () => {
  const { values, handleChange, handleSubmit } = useForm({
    nombre: '',
    correo: '',
    mensaje: '',
  });

  const handleFormSubmit = () => {
    // Lógica de validación y envío
    console.log(values);
  };

  return (
    <section id="contacto" className="seccion">
      <h2>Contacto</h2>
      <form onSubmit={e => handleSubmit(e, handleFormSubmit)}>
        <FormField
          label="Nombre:"
          type="text"
          id="contacto-nombre"
          name="nombre" // <-- AÑADIDO
          value={values.nombre}
          onChange={handleChange}
          required
        />
        <FormField
          label="Correo:"
          type="email"
          id="contacto-correo"
          name="correo" // <-- AÑADIDO
          value={values.correo}
          onChange={handleChange}
          required
        />
        <div>
          <label htmlFor="contacto-mensaje">Mensaje:</label>
          <textarea
            id="contacto-mensaje"
            name="mensaje"
            value={values.mensaje}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <Button type="submit">Enviar Mensaje</Button>
      </form>
    </section>
  );
};

export default ContactForm;