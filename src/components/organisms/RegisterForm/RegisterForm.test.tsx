import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegisterForm from './RegisterForm';
import axios from 'axios';
import { ENDPOINTS } from '../../../constants/api';

// Mocks
vi.mock('axios');
const mockedAxios = axios as vi.Mocked<typeof axios>;

// Mock para useForm (simplificado para la prueba)
const mockUseForm = vi.fn((initialValues) => {
  const [values, setValues] = vi.useState(initialValues);
  const handleChange = vi.fn((e) => {
    // Simulación básica de handleChange para inputs y selects
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
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

// Mock para regionesYComunas (para evitar dependencias de data)
vi.mock('../../../data/regions', () => ({
  regionesYComunas: {
    'Región A': ['Comuna A1', 'Comuna A2'],
    'Región B': ['Comuna B1'],
  },
}));

// Mock para ENDPOINTS
vi.mock('../../../constants/api', () => ({
  ENDPOINTS: {
    REGISTER: '/api/register',
  },
}));

describe('RegisterForm Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.post.mockResolvedValue({ status: 201, data: {} });
    // Resetear el mock de useForm para cada prueba
    mockUseForm.mockImplementation((initialValues) => {
      const [values, setValues] = vi.useState(initialValues);
      const handleChange = vi.fn((e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
      });
      const handleSubmit = vi.fn((e, callback) => {
        e.preventDefault();
        callback();
      });
      return { values, handleChange, handleSubmit };
    });
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderRegisterForm = () => {
    return render(<RegisterForm />);
  };

  it('debe renderizar el formulario con todos los campos', () => {
    renderRegisterForm();
    expect(screen.getByLabelText('Nombre Completo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByLabelText('Teléfono (opcional):')).toBeInTheDocument();
    expect(screen.getByLabelText('Región:')).toBeInTheDocument();
    expect(screen.getByLabelText('Comuna:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
  });

  it('debe mostrar las opciones de región correctamente', () => {
    renderRegisterForm();
    const regionSelect = screen.getByLabelText('Región:');
    expect(regionSelect).toHaveTextContent('Región A');
    expect(regionSelect).toHaveTextContent('Región B');
  });

  it('debe actualizar las opciones de comuna al seleccionar una región', () => {
    renderRegisterForm();
    const regionSelect = screen.getByLabelText('Región:');
    const comunaSelect = screen.getByLabelText('Comuna:');

    // Inicialmente, solo debe tener la opción por defecto
    expect(comunaSelect.children.length).toBe(1); // "Seleccione comuna"

    // Simular la selección de una región
    fireEvent.change(regionSelect, { target: { name: 'region', value: 'Región A' } });

    // Ahora debe tener las comunas de la Región A + la opción por defecto
    expect(comunaSelect.children.length).toBe(3); // "Seleccione comuna", "Comuna A1", "Comuna A2"
    expect(comunaSelect).toHaveTextContent('Comuna A1');
    expect(comunaSelect).toHaveTextContent('Comuna A2');
  });

  it('debe llamar a axios.post con los datos correctos al enviar el formulario', async () => {
    const testValues = {
      nombre: 'Test User',
      correo: 'test@example.com',
      password: 'password123',
      telefono: '123456789',
      region: 'Región A',
      comuna: 'Comuna A1',
    };

    // Sobrescribimos el mock de useForm para simular el estado del formulario
    mockUseForm.mockReturnValue({
      values: testValues,
      handleChange: vi.fn(),
      handleSubmit: vi.fn((e, callback) => {
        e.preventDefault();
        callback();
      }),
    });

    renderRegisterForm();
    
    // Simular el envío del formulario
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/register',
        {
          nombre: testValues.nombre,
          email: testValues.correo,
          password: testValues.password,
          telefono: testValues.telefono,
          region: testValues.region,
          comuna: testValues.comuna,
          role: 'CLIENT',
        }
      );
    });
    
    // Verificar mensaje de éxito y alerta
    expect(screen.getByText('¡Registro exitoso!')).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith('¡Registro exitoso! Ahora puedes iniciar sesión.');
  });

  it('debe mostrar un mensaje de error si el registro falla (error de servidor)', async () => {
    const errorMessage = 'El correo ya está registrado.';
    mockedAxios.post.mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: errorMessage } },
    });

    // Sobrescribimos el mock de useForm para simular el estado del formulario
    mockUseForm.mockReturnValue({
      values: {
        nombre: 'Test User',
        correo: 'test@example.com',
        password: 'password123',
        telefono: '',
        region: '',
        comuna: '',
      },
      handleChange: vi.fn(),
      handleSubmit: vi.fn((e, callback) => {
        e.preventDefault();
        callback();
      }),
    });

    renderRegisterForm();
    
    // Simular el envío del formulario
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    // Verificar que el botón vuelve a su estado normal
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
    expect(screen.queryByText('¡Registro exitoso!')).not.toBeInTheDocument();
  });

  it('debe deshabilitar el botón y mostrar "Registrando..." durante la carga', async () => {
    // Hacemos que la promesa de post se resuelva después de un tiempo
    mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ status: 201, data: {} }), 100)));

    // Sobrescribimos el mock de useForm para simular el estado del formulario
    mockUseForm.mockReturnValue({
      values: {
        nombre: 'Test User',
        correo: 'test@example.com',
        password: 'password123',
        telefono: '',
        region: '',
        comuna: '',
      },
      handleChange: vi.fn(),
      handleSubmit: vi.fn((e, callback) => {
        e.preventDefault();
        callback();
      }),
    });

    renderRegisterForm();
    
    const submitButton = screen.getByRole('button', { name: 'Registrarse' });
    
    // Simular el envío del formulario
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // Debe mostrar el estado de carga y estar deshabilitado
    expect(screen.getByRole('button', { name: 'Registrando...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrando...' })).toBeDisabled();

    // Esperar a que la promesa se resuelva
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });

    // Debe volver al estado normal
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).not.toBeDisabled();
  });
});
