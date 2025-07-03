const { render, screen } = require('@testing-library/react');
const Page = require('./page');

test('renders page without crashing', () => {
	render(<Page />);
	const linkElement = screen.getByText(/some text in your page/i);
	expect(linkElement).toBeInTheDocument();
});