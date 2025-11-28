import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';

// Mocks
const mockLogin = vi.fn();
const mockUseAuth = vi.fn(() => ({
  login: mockLogin,
}));

vi.doMock('../../../hooks/useAuth', () => {
  return {
    useAuth: mockUseAuth,
  };
});

// Mock para useForm (simplificado para la prueba)
const mockUseForm = vi.fn((initialValues) => {
  const [values, setValues] = vi.useState(initialValues);
  const handleChange = vi.fn((e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  });
  const handleSubmit = vi.fn((e, callback) => {
    e.preventDefault();
    callback();
  });
  return { values, handleChange, handleSubmit };
});

vi.doMock('../../../hooks/useForm', () => {
  return {
    default: mockUseForm,
  };
});

// Mock para useNavigate
const mockUseNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
  };
});

// Mock para FormField (para evitar dependencias de moléculas)
vi.mock('../../molecules/FormField/FormField', () => ({
  default: ({ label, type, id, name, value, onChange, required }) => (
    <div data-testid={`form-field-${name}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        data-testid={`input-${name}`}
      />
    </div>
  ),
}));

describe('LoginForm Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
  };

  it('debe renderizar el formulario con los campos de correo y contraseña', () => {
    renderLoginForm();
    expect(screen.getByLabelText('Correo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('debe manejar la entrada de datos en los campos', () => {
    renderLoginForm();
    const emailInput = screen.getByTestId('input-correo');
    const passwordInput = screen.getByTestId('input-password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'correo' } });
    fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });

    // Verificamos que useForm.handleChange fue llamado con los valores correctos
    // El mock de useForm es un poco limitado, pero podemos verificar que los inputs tienen los valores
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('debe llamar a login con los valores correctos al enviar el formulario', async () => {
    // Sobrescribimos el mock de useForm para simular el estado del formulario
    mockUseForm.mockReturnValue({
      values: { correo: 'test@example.com', password: 'password123' },
      handleChange: vi.fn(),
      handleSubmit: vi.fn((e, callback) => {
        e.preventDefault();
        callback();
      }),
    });

    renderLoginForm();
    
    // Simular el envío del formulario
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    // Verificar que el mensaje de error no se muestra
    expect(screen.queryByText(/Error desconocido/i)).not.toBeInTheDocument();
  });

  it('debe mostrar un mensaje de error si el inicio de sesión falla', async () => {
    const errorMessage = 'Credenciales inválidas';
    mockLogin.mockRejectedValue(new Error(errorMessage));

    // Sobrescribimos el mock de useForm para simular el estado del formulario
    mockUseForm.mockReturnValue({
      values: { correo: 'test@example.com', password: 'password123' },
      handleChange: vi.fn(),
      handleSubmit: vi.fn((e, callback) => {
        e.preventDefault();
        callback();
      }),
    });

    renderLoginForm();
    
    // Simular el envío del formulario
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    // Verificar que el botón vuelve a su estado normal
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('debe deshabilitar el botón y mostrar "Iniciando..." durante la carga', async () => {
    // Hacemos que la promesa de login se resuelva después de un tiempo
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    // Sobrescribimos el mock de useForm para simular el estado del formulario
    mockUseForm.mockReturnValue({
      values: { correo: 'test@example.com', password: 'password123' },
      handleChange: vi.fn(),
      handleSubmit: vi.fn((e, callback) => {
        e.preventDefault();
        callback();
      }),
    });

    renderLoginForm();
    
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    
    // Simular el envío del formulario
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // Debe mostrar el estado de carga y estar deshabilitado
    expect(screen.getByRole('button', { name: 'Iniciando...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciando...' })).toBeDisabled();

    // Esperar a que la promesa se resuelva
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    // Debe volver al estado normal
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).not.toBeDisabled();
  });
});
