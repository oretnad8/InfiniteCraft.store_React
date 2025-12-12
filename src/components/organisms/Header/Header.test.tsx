import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        user: null,
        logout: vi.fn(),
    }),
}));

describe('Header Component', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <Header cartCount={0} onCartClick={() => { }} />
            </BrowserRouter>
        );
        expect(document.body).toBeInTheDocument();
    });
});
