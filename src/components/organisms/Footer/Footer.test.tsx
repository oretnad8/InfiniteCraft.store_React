import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';
import { BrowserRouter } from 'react-router-dom';

describe('Footer Component', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        expect(document.body).toBeInTheDocument();
    });
});
