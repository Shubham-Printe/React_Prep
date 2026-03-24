// render: mounts the component into a fake DOM (jsdom) for testing
// screen: object to query the rendered output (getByRole, getByText, etc.)
import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
// userEvent: simulates real user interactions (clicks, typing) in a more realistic way than fireEvent
import userEvent from '@testing-library/user-event';

// Group all tests for the TermsAndConditions component under one suite
describe('TermsAndConditions', () => {
    // Helper that renders the component once and returns references to the main elements we need.
    // This avoids repeating render + getByRole in every test and keeps queries consistent.
    const renderComponent = () => {
        // Render the component into the test DOM (no real browser).
        render(<TermsAndConditions />);

        // Query the DOM by accessibility role (recommended: mirrors how users/screen readers find elements).
        // Returns an object so tests can destructure only what they need.
        return {
            heading: screen.getByRole('heading'),
            checkbox: screen.getByRole('checkbox'),
            submitButton: screen.getByRole('button'),
        };
    };

    it('should render with correct text and initial state', () => {
        // Render and get references to heading, checkbox, and submit button in one call.
        const { heading, checkbox, submitButton } = renderComponent();

        // The main heading must show "Terms & Conditions".
        expect(heading).toHaveTextContent('Terms & Conditions');

        // Checkbox must start unchecked (user has not agreed yet).
        expect(checkbox).not.toBeChecked();

        // Submit must be disabled until the user checks the checkbox.
        expect(submitButton).toBeDisabled();
    });

    it('should enable the submit button when the checkbox is checked', async () => {
        // Arrange: render the component and get the checkbox and submit button.
        const { checkbox, submitButton } = renderComponent();

        // Act: create a userEvent instance and simulate the user checking the checkbox.
        const user = userEvent.setup();
        await user.click(checkbox);

        // Assert: after checking, the submit button should become enabled.
        expect(submitButton).toBeEnabled();
    });
});