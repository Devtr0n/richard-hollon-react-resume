import React, { useRef, useEffect, useCallback } from 'react';

function Header({ data }) {
  const navRef = useRef(null);
  const sectionObserverRef = useRef(null);

  const handleScroll = useCallback(() => {
	const nav = navRef.current;

	const headerEl = document.querySelector('header');
	const headerHeight = headerEl ? headerEl.offsetHeight : 0;
	const y = window.scrollY;

	if (y > headerHeight * 0.2 && y < headerHeight && window.innerWidth > 768) {
	  nav.style.display = 'none';
	} else {
	  nav.style.display = '';
	}
  }, []);

  const handleNavClick = useCallback((e) => {
	const targetId = e.currentTarget.getAttribute('href');
	if (!targetId || !targetId.startsWith('#')) return;
	const target = document.querySelector(targetId);
	if (!target) return;

	e.preventDefault();
	target.scrollIntoView({ behavior: 'smooth' });
	window.history.pushState(null, '', targetId);
  }, []);

  useEffect(() => {
	window.addEventListener('scroll', handleScroll);

	const sections = document.querySelectorAll('section, header#home');
	if (sections.length && typeof IntersectionObserver !== 'undefined') {
	  sectionObserverRef.current = new IntersectionObserver(
		(entries) => {
		  entries.forEach((entry) => {
			if (entry.isIntersecting) {
			  const navLinks = document.querySelectorAll('#nav-wrap a');
			  navLinks.forEach((link) => link.parentElement.classList.remove('current'));
			  const activeLink = document.querySelector(`#nav-wrap a[href="#${entry.target.id}"]`);
			  if (activeLink) activeLink.parentElement.classList.add('current');
			}
		  });
		},
		{ rootMargin: '-35% 0px -35% 0px' }
	  );

	  sections.forEach((section) => sectionObserverRef.current.observe(section));
	}

	return () => {
	  window.removeEventListener('scroll', handleScroll);
	  if (sectionObserverRef.current) {
		sectionObserverRef.current.disconnect();
	  }
	};
  }, [handleScroll]);

  let name, occupation, description, resumeDownload, networks;
  if (data) {
	name = data.name;
	occupation = data.occupation;
	description = data.description;
	resumeDownload = data.resumedownload;
	networks = data.social.map((network) => (
	  <li key={network.name}><a href={network.url}><i className={network.className}></i></a></li>
	));
  }

  return (
	<header id="home">

	<nav id="nav-wrap" ref={navRef}>

	   <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
		  <a className="mobile-btn" href="#home" title="Hide navigation">Hide navigation</a>

	   <ul id="nav" className="nav">
		  <li><a className="smoothscroll" href="#about" onClick={handleNavClick}>About</a></li>
			 <li><a className="smoothscroll" href="#resume" onClick={handleNavClick}>Resume</a></li>
		  <li><a className="smoothscroll" href="#portfolio" onClick={handleNavClick}>Works</a></li>
		  <li><a className="smoothscroll" href="#testimonials" onClick={handleNavClick}>Testimonials</a></li>
		  <li><a className="smoothscroll" href="#contact" onClick={handleNavClick}>Contact</a></li>
	   </ul>

	</nav>

	<div className="row banner">
	   <div className="banner-text">
		  <h1 className="responsive-headline">I'm {name}.</h1>
		  <h3>I'm a New Braunfels, Texas based <span>{occupation}</span>. {description}.</h3>
		  <hr />
			<ul className="social">
			   {networks}
			</ul>
			<div className="banner-buttons">
			  <a href={resumeDownload} className="button resume-button">Resume <i className="fa fa-download"></i></a>
			  <a className="button contact-button smoothscroll" href="#contact" onClick={handleNavClick}>Contact</a>
			</div>
			 </div>
		  </div>

	<p className="scrolldown">
	   <a className="smoothscroll" href="#about" onClick={handleNavClick}><i className="icon-down-circle"></i></a>
	</p>

 </header>
  );
}

export default Header;
