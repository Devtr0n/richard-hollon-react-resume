import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

const data = {
  name: 'Richard Hollon',
  image: 'profilepic.jpg',
  bio: 'I am a software engineer based in New Braunfels, Texas.',
  address: {
    street: '1429 Escarpment Rd',
    city: 'New Braunfels',
    state: 'Texas',
    zip: '78132',
  },
  phone: '555-555-5555',
  email: 'richardsmailbox@gmail.com',
  resumedownload: '/content/Richard.Hollon.Resume.2021.pdf',
};

describe('About', () => {
  it('renders the bio text', () => {
    render(<About data={data} />);
    expect(screen.getByText(data.bio)).toBeInTheDocument();
  });

  it('renders contact details', () => {
    const { container } = render(<About data={data} />);
    const addressText = container.querySelector('.address').textContent;
    expect(addressText).toContain(data.address.street);
    expect(addressText).toContain(data.phone);
    expect(addressText).toContain(data.email);
  });

  it('links the resume download button to the correct file', () => {
    render(<About data={data} />);
    expect(screen.getByText('Download Resume')).toHaveAttribute(
      'href',
      data.resumedownload
    );
  });
});
