import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './page';

test('renders page without crashing', () => {
	render(<Page />);
	const linkElement = screen.getByText(/some text in your page/i);
	expect(linkElement).toBeInTheDocument();
});