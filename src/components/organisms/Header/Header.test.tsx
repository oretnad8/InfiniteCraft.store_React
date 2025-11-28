import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock simple para useAuth
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
  })),
}));

// Mock simple para useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Header Organism (Simple Test)', () => {
  it('debe renderizar el componente sin errores', () => {
    render(
      <BrowserRouter>
        <Header cartCount={0} onCartClick={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByText('InfiniteCraft.store')).toBeInTheDocument();
    expect(screen.getByText(/Carrito \(0\)/i)).toBeInTheDocument();
  });
});
