import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegisterForm from './RegisterForm';

// Mock simple para useForm
vi.mock('../../../hooks/useForm', () => ({
  default: vi.fn(() => ({
    values: { nombre: '', correo: '', password: '', telefono: '', region: '', comuna: '' },
    handleChange: vi.fn(),
    handleSubmit: vi.fn((e, callback) => {
      e.preventDefault();
      callback();
    }),
  })),
}));

// Mock para FormField (para evitar dependencias de moléculas)
vi.mock('../../molecules/FormField/FormField', () => ({
  default: ({ label, type, id, name, value, onChange, required }) => (
    <input type={type} id={id} name={name} placeholder={label} />
  ),
}));

// Mock para regionesYComunas
vi.mock('../../../data/regions', () => ({
  regionesYComunas: {
    'Región A': ['Comuna A1'],
  },
}));

describe('RegisterForm Organism (Simple Test)', () => {
  it('debe renderizar el componente sin errores', () => {
    render(<RegisterForm />);
    expect(screen.getByRole('heading', { name: 'Registro de Usuario' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
  });
});
