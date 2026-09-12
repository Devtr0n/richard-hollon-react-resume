import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Resume from './Resume';

const data = {
  skillmessage: 'These are my skills.',
  education: [
    {
      school: 'University of Texas',
      degree: 'B.S. Computer Science',
      graduated: '2005',
      description: 'Studied software engineering.',
    },
  ],
  work: [
    {
      company: 'Instant Domains',
      title: 'Full Stack Software Engineer',
      years: '2022 - Present',
      description: 'Building a modern, mobile-first domain registrar.',
    },
  ],
  skills: [
    { name: 'React', level: '90%' },
    { name: 'CSharp', level: '95%' },
  ],
};

describe('Resume', () => {
  it('renders the skill message', () => {
    render(<Resume data={data} />);
    expect(screen.getByText(data.skillmessage)).toBeInTheDocument();
  });

  it('renders education entries', () => {
    render(<Resume data={data} />);
    expect(screen.getByText(data.education[0].school)).toBeInTheDocument();
    expect(screen.getByText(data.education[0].description)).toBeInTheDocument();
  });

  it('renders work entries', () => {
    render(<Resume data={data} />);
    expect(screen.getByText(data.work[0].company)).toBeInTheDocument();
    expect(screen.getByText(data.work[0].description)).toBeInTheDocument();
  });

  it('renders skill bars with the correct width and name', () => {
    const { container } = render(<Resume data={data} />);
    const reactSkill = container.querySelector('.bar-expand.react');
    expect(reactSkill).toHaveStyle({ width: '90%' });
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders without crashing when no data is provided', () => {
    render(<Resume />);
    expect(document.querySelector('#resume')).toBeInTheDocument();
  });
});
