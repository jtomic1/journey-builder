import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Navbar from '../navbar';

describe('Navbar', () => {
  it('renders the title', () => {
    render(<Navbar title='My App' />);
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('has the correct class', () => {
    render(<Navbar title='My App' />);
    const div = screen.getByText('My App');
    expect(div).toHaveClass('navbar');
  });
});
