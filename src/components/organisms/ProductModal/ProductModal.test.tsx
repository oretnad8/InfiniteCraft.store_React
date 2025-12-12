import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductModal from './ProductModal';

describe('ProductModal Component', () => {
    it('renders null when product is null', () => {
        const { container } = render(
            <ProductModal product={null} onClose={() => { }} onAddToCart={() => { }} />
        );
        expect(container).toBeEmptyDOMElement();
    });
});
