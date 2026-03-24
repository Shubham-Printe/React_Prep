import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';


describe('TermsAndConditions', () => {
    
    const renderComponent = () => {
        render(<TermsAndConditions/>);

        return {
            heading: screen.getByRole('heading'),
            checkbox: screen.getByRole('checkbox'),
            submitButton: screen.getByRole('button'),
        }
    }

    it("should render with correct text and initial state", () => {

        const { heading, checkbox, submitButton } = renderComponent();
 
        expect(heading).toHaveTextContent("Terms & Conditions")
 
        expect(checkbox).not.toBeChecked();
 
        expect(submitButton).toBeDisabled();
    })

    it("should enable the submit button when the checkbox is checked", async () => {
        // arrange
        const { checkbox, submitButton } = renderComponent();

        // act
        const user = userEvent.setup();
        await user.click(checkbox);

        // assert
        expect(submitButton).toBeEnabled();
        
    })
})