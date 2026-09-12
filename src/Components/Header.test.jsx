import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

const data = {
  name: 'Richard Hollon',
  occupation: 'Senior Full Stack .NET Developer',
  description: 'with over 20 years of relevant experience.',
  resumedownload: '/content/Richard.Hollon.Resume.2021.pdf',
  social: [
    { name: 'github', url: 'http://github.com/Devtr0n', className: 'fa fa-github' },
  ],
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Header', () => {
  it('renders the headline with the provided name', () => {
    render(<Header data={data} />);
    expect(screen.getByText(`I'm ${data.name}.`)).toBeInTheDocument();
  });

  it('renders nav links for all sections', () => {
    const { container } = render(<Header data={data} />);
    ['About', 'Resume', 'Works', 'Testimonials', 'Contact'].forEach((label) => {
      const navLink = container.querySelector(`#nav a[href="#${label === 'Works' ? 'portfolio' : label.toLowerCase()}"]`);
      expect(navLink).toHaveTextContent(label);
    });
  });

  it('renders the Resume and Contact buttons in the banner', () => {
    const { container } = render(<Header data={data} />);
    const resumeButton = container.querySelector('.banner-buttons .resume-button');
    const contactButton = container.querySelector('.banner-buttons .contact-button');
    expect(resumeButton).toHaveAttribute('href', data.resumedownload);
    expect(contactButton).toHaveAttribute('href', '#contact');
  });

  it('renders social links from data', () => {
    const { container } = render(<Header data={data} />);
    const link = container.querySelector('.social a');
    expect(link).toHaveAttribute('href', data.social[0].url);
  });

  it('does not intercept clicks on non-hash hrefs', async () => {
    const { container } = render(<Header data={data} />);
    const aboutLink = container.querySelector('#nav a[href="#about"]');
    aboutLink.setAttribute('href', 'javascript:void(0)');
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    const user = userEvent.setup();
    await user.click(aboutLink);

    expect(pushStateSpy).not.toHaveBeenCalled();
    pushStateSpy.mockRestore();
  });

  it('smooth-scrolls to the target section on nav click without jQuery', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    render(<Header data={data} />, { container: document.getElementById('root') });

    const aboutSection = document.createElement('section');
    aboutSection.id = 'about';
    aboutSection.scrollIntoView = vi.fn();
    document.body.appendChild(aboutSection);

    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(aboutSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('hides the nav while scrolling through the header on wide screens', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    const { container } = render(<Header data={data} />);

    const headerEl = container.querySelector('header');
    Object.defineProperty(headerEl, 'offsetHeight', { value: 500 });

    const nav = container.querySelector('#nav-wrap');

    window.scrollY = 200;
    window.dispatchEvent(new Event('scroll'));
    expect(nav.style.display).toBe('none');

    window.scrollY = 600;
    window.dispatchEvent(new Event('scroll'));
    expect(nav.style.display).toBe('');
  });

  it('marks the nav link for the intersecting section as current', () => {
    document.body.innerHTML = '<div id="root"></div>';
    let observerCallback;
    const observe = vi.fn();
    const disconnect = vi.fn();
    const originalIO = window.IntersectionObserver;
    window.IntersectionObserver = function (callback) {
      observerCallback = callback;
      return { observe, disconnect, unobserve: vi.fn() };
    };

    const { unmount } = render(<Header data={data} />, {
      container: document.getElementById('root'),
    });

    const aboutSection = document.createElement('section');
    aboutSection.id = 'about';
    document.body.appendChild(aboutSection);

    observerCallback([{ isIntersecting: true, target: aboutSection }]);

    const activeLink = document.querySelector('#nav-wrap a[href="#about"]');
    expect(activeLink.parentElement).toHaveClass('current');

    unmount();
    expect(disconnect).toHaveBeenCalled();

    window.IntersectionObserver = originalIO;
  });

  it('does nothing when clicking a nav link whose target section does not exist', async () => {
    const { container } = render(<Header data={data} />);
    const aboutLink = container.querySelector('#nav a[href="#about"]');
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    const user = userEvent.setup();
    await user.click(aboutLink);

    expect(pushStateSpy).not.toHaveBeenCalled();
    pushStateSpy.mockRestore();
  });

  it('does not throw when the scroll handler runs before the nav has mounted', () => {
    const { container, unmount } = render(<Header data={data} />);
    const nav = container.querySelector('#nav-wrap');
    // simulate the nav ref not being attached yet
    Object.defineProperty(nav, 'style', { value: {}, configurable: true });
    unmount();

    expect(() => window.dispatchEvent(new Event('scroll'))).not.toThrow();
  });

  it('does not throw the scroll handler when there is no header element in the document', () => {
    render(<Header data={data} />);
    const querySelectorSpy = vi
      .spyOn(document, 'querySelector')
      .mockImplementation((selector) => (selector === 'header' ? null : Document.prototype.querySelector.call(document, selector)));

    expect(() => window.dispatchEvent(new Event('scroll'))).not.toThrow();

    querySelectorSpy.mockRestore();
  });

  it('does not mark any nav link when the intersecting section has no matching link', () => {
    document.body.innerHTML = '<div id="root"></div>';
    let observerCallback;
    const originalIO = window.IntersectionObserver;
    window.IntersectionObserver = function (callback) {
      observerCallback = callback;
      return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
    };

    render(<Header data={data} />, { container: document.getElementById('root') });

    const unmatchedSection = document.createElement('section');
    unmatchedSection.id = 'unmatched-section';
    document.body.appendChild(unmatchedSection);

    expect(() =>
      observerCallback([{ isIntersecting: true, target: unmatchedSection }])
    ).not.toThrow();

    const currentLinks = document.querySelectorAll('#nav-wrap li.current');
    expect(currentLinks.length).toBe(0);

    window.IntersectionObserver = originalIO;
  });

  it('does nothing when an observed entry is not intersecting', () => {
    document.body.innerHTML = '<div id="root"></div>';
    let observerCallback;
    const originalIO = window.IntersectionObserver;
    window.IntersectionObserver = function (callback) {
      observerCallback = callback;
      return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
    };

    render(<Header data={data} />, { container: document.getElementById('root') });

    const aboutSection = document.createElement('section');
    aboutSection.id = 'about';
    document.body.appendChild(aboutSection);

    expect(() =>
      observerCallback([{ isIntersecting: false, target: aboutSection }])
    ).not.toThrow();

    window.IntersectionObserver = originalIO;
  });
});
