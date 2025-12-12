import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Cart from './Cart';

describe('Cart Component', () => {
    it('renders without crashing', () => {
        const mockProps = {
            cart: { items: [], total: 0 },
            onClose: () => { },
            onRemoveFromCart: () => { },
            onUpdateQuantity: () => { },
            onCheckout: () => { },
        };
        render(<Cart {...mockProps} />);
        // Add more specific assertions based on Cart content if needed
        expect(screen.getByText(/Mi Carrito/i)).toBeInTheDocument();
    });
});
