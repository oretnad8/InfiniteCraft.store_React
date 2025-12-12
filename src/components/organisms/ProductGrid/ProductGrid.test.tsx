import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductGrid from './ProductGrid';

describe('ProductGrid Component', () => {
    it('renders without crashing', () => {
        render(<ProductGrid products={[]} onViewDetails={() => { }} />);
        // Might need mocking if it fetches data on mount
        expect(document.body).toBeInTheDocument();
    });
});
