import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegisterForm from './RegisterForm';
import { BrowserRouter } from 'react-router-dom';

describe('RegisterForm Component', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <RegisterForm />
            </BrowserRouter>
        );
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    });
});
