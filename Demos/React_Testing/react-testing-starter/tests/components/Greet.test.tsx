import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

/**
 * Tests for the Greet component.
 * Greet shows a personalized greeting when `name` is passed, or a Login button when it is not.
 */
describe('Greet', () => {
    it('should render Hello with the name when name is provided', () => {
        render(<Greet name="Mosh" />);

        // Prefer getByRole: matches how users and assistive tech find the heading
        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/mosh/i);
    });

    it('should render Login button when name is not provided', () => {
        render(<Greet />);

        // When name is omitted, component renders a single button (Login)
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/login/i);
    });
});