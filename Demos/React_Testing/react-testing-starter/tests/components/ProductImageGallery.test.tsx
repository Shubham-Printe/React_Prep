import { render, screen } from '@testing-library/react';
import ProductImageGallery from '../../src/components/ProductImageGallery';


const imageUrls = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
]

describe("Product Image Gallery", () => {
    it("should render no images when imageUrls array is empty", () => {
        const {container} = render(<ProductImageGallery imageUrls={[]}/>);
 
        
        // assert that the DOM is empty
        expect(container).toBeEmptyDOMElement();
    })

    it("should render a list of images when imageUrls array is not empty", () => {
        render(<ProductImageGallery imageUrls={imageUrls}/>);

        const images = screen.getAllByRole('img');

        expect(images).toHaveLength(imageUrls.length);

        imageUrls.forEach((url, index) =>{
            expect(images[index]).toHaveAttribute('src', url);
        })
        

    })
})