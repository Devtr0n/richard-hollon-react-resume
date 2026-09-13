import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from './Footer';

const data = {
  social: [
    { name: 'github', url: 'http://github.com/Devtr0n', className: 'fa fa-github' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/richardhollon/', className: 'fa fa-linkedin' },
  ],
};

describe('Footer', () => {
  it('renders a link for each social entry', () => {
    const { container } = render(<Footer data={data} />);
    const links = container.querySelectorAll('.social-links a');
    expect(links).toHaveLength(data.social.length);
    expect(links[0]).toHaveAttribute('href', data.social[0].url);
    expect(links[0]).toHaveAttribute('aria-label', data.social[0].name);
    expect(links[1]).toHaveAttribute('href', data.social[1].url);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('scrolls back to top without jQuery when clicked', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    render(<Footer data={data} />, { container: document.getElementById('root') });

    const homeSection = document.createElement('header');
    homeSection.id = 'home';
    homeSection.scrollIntoView = vi.fn();
    document.body.appendChild(homeSection);

    const user = userEvent.setup();
    await user.click(screen.getByTitle('Back to Top'));

    expect(homeSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
