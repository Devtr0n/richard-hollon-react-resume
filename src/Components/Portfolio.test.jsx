import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Portfolio from './Portfolio';

const data = {
  projects: [
    {
      title: 'Project One',
      category: 'Web App',
      image: 'project-one.jpg',
      url: 'https://example.com/project-one',
    },
    {
      title: 'Project Two',
      category: 'API',
      image: 'project-two.jpg',
      url: 'https://example.com/project-two',
    },
  ],
};

describe('Portfolio', () => {
  it('renders a link for each project with its real external url', () => {
    render(<Portfolio data={data} />);
    data.projects.forEach((project) => {
      const link = screen.getByTitle(project.title);
      expect(link).toHaveAttribute('href', project.url);
    });
  });

  it('opens each project link in a new tab safely', () => {
    render(<Portfolio data={data} />);
    data.projects.forEach((project) => {
      const link = screen.getByTitle(project.title);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders the project title and category', () => {
    render(<Portfolio data={data} />);
    data.projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
      expect(screen.getByText(project.category)).toBeInTheDocument();
    });
  });

  it('renders a lazy-loaded WebP source alongside the JPEG thumbnail fallback', () => {
    render(<Portfolio data={data} />);
    data.projects.forEach((project) => {
      const img = screen.getByAltText(project.title);
      expect(img).toHaveAttribute('src', `images/portfolio/${project.image}`);
      expect(img).toHaveAttribute('loading', 'lazy');
      const source = img.closest('picture').querySelector('source');
      expect(source).toHaveAttribute(
        'srcset',
        `images/portfolio/${project.image.replace(/\.jpg$/, '.webp')}`
      );
      expect(source).toHaveAttribute('type', 'image/webp');
    });
  });
});
