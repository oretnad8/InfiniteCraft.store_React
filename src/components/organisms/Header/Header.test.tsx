import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock de los hooks
const mockUseAuth = vi.fn();
const mockUseNavigate = vi.fn();

vi.doMock('../../../hooks/useAuth', () => {
  return {
    useAuth: mockUseAuth,
  };
});

vi.doMock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
  };
});

const renderHeader = (props = { cartCount: 0, onCartClick: vi.fn() }, authProps = { isAuthenticated: false, user: null, logout: vi.fn() }) => {
  mockUseAuth.mockReturnValue(authProps);
  return render(
    <BrowserRouter>
      <Header {...props} />
    </BrowserRouter>
  );
};

describe('Header Organism', () => {
  it('debe renderizar el nombre de la marca y los enlaces de navegación', () => {
    renderHeader();
    expect(screen.getByText('InfiniteCraft.store')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('debe mostrar el contador de carrito y llamar a onCartClick al hacer clic', () => {
    const onCartClickMock = vi.fn();
    renderHeader({ cartCount: 5, onCartClick: onCartClickMock });

    const cartButton = screen.getByText(/Carrito \(5\)/i);
    expect(cartButton).toBeInTheDocument();

    fireEvent.click(cartButton);
    expect(onCartClickMock).toHaveBeenCalledTimes(1);
  });

  describe('Cuando el usuario NO está autenticado', () => {
    it('NO debe mostrar información de usuario ni botón de cerrar sesión', () => {
      renderHeader();
      expect(screen.queryByText(/Bienvenido/i)).not.toBeInTheDocument();
      expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
      expect(screen.queryByText('Panel')).not.toBeInTheDocument();
    });
  });

  describe('Cuando el usuario está autenticado', () => {
    const commonUser = { isAuthenticated: true, user: { role: 'CLIENT', nombre: 'Juan' }, logout: vi.fn() };
    const sellerUser = { isAuthenticated: true, user: { role: 'SELLER', nombre: 'Pedro' }, logout: vi.fn() };
    const adminUser = { isAuthenticated: true, user: { role: 'ADMIN', nombre: 'Admin' }, logout: vi.fn() };

    it('debe mostrar el nombre y rol del usuario (CLIENTE)', () => {
      renderHeader(undefined, commonUser);
      expect(screen.getByText('Bienvenido, Cliente Juan')).toBeInTheDocument();
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
      expect(screen.queryByText('Panel')).not.toBeInTheDocument();
    });

    it('debe mostrar el nombre y rol del usuario (VENDEDOR) y el botón Panel', () => {
      renderHeader(undefined, sellerUser);
      expect(screen.getByText('Bienvenido, Vendedor Pedro')).toBeInTheDocument();
      expect(screen.getByText('Panel')).toBeInTheDocument();
    });

    it('debe mostrar el nombre y rol del usuario (ADMIN) y el botón Panel', () => {
      renderHeader(undefined, adminUser);
      expect(screen.getByText('Bienvenido, Admin Admin')).toBeInTheDocument();
      expect(screen.getByText('Panel')).toBeInTheDocument();
    });

    it('debe llamar a logout al hacer clic en Cerrar Sesión', () => {
      const logoutMock = vi.fn();
      renderHeader(undefined, { ...commonUser, logout: logoutMock });

      fireEvent.click(screen.getByText('Cerrar Sesión'));
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });

    it('debe navegar a /admin al hacer clic en Panel (VENDEDOR)', () => {
      renderHeader(undefined, sellerUser);

      fireEvent.click(screen.getByText('Panel'));
      expect(mockUseNavigate).toHaveBeenCalledWith('/admin');
    });
  });
});
