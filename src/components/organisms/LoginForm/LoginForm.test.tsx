import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../hooks/useAuth', () => ({
    useAuth: () => ({
        login: vi.fn(),
        isLoading: false,
    }),
}));

describe('LoginForm Component', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        );
        expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
    });
});
