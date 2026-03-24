import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';

const user = {
    id: 1,
    name: "Mosh",
    isAdmin: true,
}

describe("UserAccount", () => {
    it("should render the username", () => {
        render(<UserAccount user={user}/>);

        const name = screen.getByText(user.name);
        expect(name).toBeInTheDocument();
        expect(name).toHaveTextContent(user.name);
    })

    it("should render if the user is an admin", () => {
        render(<UserAccount user={user}/>);

        const editButton = screen.queryByRole('button', { name: 'Edit' });
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveTextContent(/edit/i);
    })

    it("should not render if the user is not an admin", ()=> {
        render(<UserAccount user={{...user, isAdmin: false}}/>);

        const editButton = screen.queryByRole('button', { name: 'Edit' });
        expect(editButton).not.toBeInTheDocument();
    })
})

