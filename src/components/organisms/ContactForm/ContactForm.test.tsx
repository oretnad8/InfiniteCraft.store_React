import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ContactForm from './ContactForm';

describe('ContactForm Component', () => {
    it('renders without crashing', () => {
        render(<ContactForm />);
        // Basic check for form elements can be added here
        expect(document.body).toBeInTheDocument();
    });
});
