import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProcessSection from './ProcessSection';

describe('ProcessSection Component', () => {
    it('renders without crashing', () => {
        render(<ProcessSection />);
        expect(document.body).toBeInTheDocument();
    });
});
