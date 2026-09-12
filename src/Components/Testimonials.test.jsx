import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Testimonials from './Testimonials';

const data = {
  testimonials: [
    { text: 'Richard is a fantastic engineer.', user: 'Jane Doe' },
    { text: 'Highly recommend working with him.', user: 'John Smith' },
  ],
};

describe('Testimonials', () => {
  it('renders each testimonial quote and author', () => {
    render(<Testimonials data={data} />);
    data.testimonials.forEach((testimonial) => {
      expect(screen.getByText(testimonial.text)).toBeInTheDocument();
      expect(screen.getByText(testimonial.user)).toBeInTheDocument();
    });
  });

  it('renders the section heading', () => {
    render(<Testimonials data={data} />);
    expect(screen.getByText('Client Testimonials')).toBeInTheDocument();
  });

  it('renders without crashing when no data is provided', () => {
    render(<Testimonials />);
    expect(document.querySelector('#testimonials')).toBeInTheDocument();
  });
});
