import { render, screen } from '@testing-library/react';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

const textShort = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.";
const textLarge = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias architecto quos magnam accusamus distinctio quidem in, odit quis! Laborum adipisci beatae a totam, error similique repellendus distinctio facere, recusandae tempore ducimus maxime fugit, culpa aliquam minima odio voluptatem nostrum saepe. Dolorem dignissimos officiis ipsam rerum? Esse ipsa tempora nesciunt aliquid consequuntur iste omnis ex nulla exercitationem! Culpa veniam dolore temporibus perferendis corrupti hic exercitationem fugit dicta consequuntur voluptatibus. Quo molestiae ipsam quaerat adipisci cupiditate unde quasi expedita quod maiores ab necessitatibus ratione facere voluptatum totam consectetur id ullam nobis, inventore error modi, recusandae non iste fugit molestias. Eligendi, quia repellat."
const limit = 255;
const truncatedText = textLarge.substring(0, limit) + "...";

describe("ExpandableText", () => {

    it("should render the full text if less than 255 characters and render no button", () => {
        render(<ExpandableText text={textShort} />);

        const article = screen.getByRole('article');
        expect(article).toBeInTheDocument();
        expect(article).toHaveTextContent(textShort);

        const button = screen.queryByRole('button');
        expect(button).not.toBeInTheDocument();
    })

    it("should render with correct text and initial state", () => {
        render(<ExpandableText text={textLarge} />);

        

        const article = screen.getByRole('article');
        expect(article).toBeInTheDocument();
        expect(article).toHaveTextContent(truncatedText);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/show more/i);
    })

    it("should show the full text when the Show More button is clicked", async() => {
        // arrange
        render(<ExpandableText text={textLarge} />);

        // act
        const showMoreButton = screen.getByRole('button', { name: /show more/i });
        const user = userEvent.setup();
        await user.click(showMoreButton);

        // assert
        const article1 = screen.getByRole('article');
        expect(article1).toHaveTextContent(textLarge);
        expect(showMoreButton).toHaveTextContent(/show less/i);
    })

    it("should show the truncated text when the Show Less button is clicked", async() => {
        // arrange
        render(<ExpandableText text={textLarge} />);
        const showMoreButton = screen.getByRole('button', { name: /show more/i });
        const user = userEvent.setup();
        await user.click(showMoreButton);

        // act
        const showLessButton = screen.getByRole('button', { name: /show less/i });
        await user.click(showLessButton);

        // assert
        const article = screen.getByRole('article');
        expect(article).toHaveTextContent(truncatedText);
        expect(showMoreButton).toHaveTextContent(/show more/i);
    })
})