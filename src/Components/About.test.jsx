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
  study: 'Texas State Technical College',
  interests: 'Travel, Hummingbirds, Cooking',
  employment: 'iAAWG / iA American Financial Group',
  resumedownload: '/content/Richard.Hollon.Resume.2021.pdf',
};

describe('About', () => {
  it('renders the bio text', () => {
    render(<About data={data} />);
    expect(screen.getByText(data.bio)).toBeInTheDocument();
  });

  it('renders phone and email in the info list', () => {
    render(<About data={data} />);
    expect(screen.getByText(data.phone)).toBeInTheDocument();
    expect(screen.getByText(data.email)).toBeInTheDocument();
  });

  it('does not render a Contact Details section', () => {
    render(<About data={data} />);
    expect(screen.queryByText('Contact Details')).not.toBeInTheDocument();
  });

  it('links the resume download button to the correct file', () => {
    render(<About data={data} />);
    expect(screen.getByText('Download Resume')).toHaveAttribute(
      'href',
      data.resumedownload
    );
  });

  it('renders the study, interests, and employment info list', () => {
    render(<About data={data} />);
    expect(screen.getByText('Study:')).toBeInTheDocument();
    expect(screen.getByText(data.study)).toBeInTheDocument();
    expect(screen.getByText('Interests:')).toBeInTheDocument();
    expect(screen.getByText(data.interests)).toBeInTheDocument();
    expect(screen.getByText('Employment:')).toBeInTheDocument();
    expect(screen.getByText(data.employment)).toBeInTheDocument();
  });
});
