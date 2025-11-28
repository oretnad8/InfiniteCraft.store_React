import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';

// Mock simple para useAuth
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    login: vi.fn(),
  })),
}));

// Mock simple para useForm
vi.mock('../../../hooks/useForm', () => ({
  default: vi.fn(() => ({
    values: { correo: '', password: '' },
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

describe('LoginForm Organism (Simple Test)', () => {
  it('debe renderizar el componente sin errores', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });
});
