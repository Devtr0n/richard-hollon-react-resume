import React from 'react';
import PropTypes from 'prop-types';

function Footer({ data }) {
  const handleBackToTop = (e) => {
    e.preventDefault();
    document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '#home');
  };

  let networks;
  if (data) {
    networks = data.social.map((network) => (
      <li key={network.name}><a href={network.url} target="_blank" rel="noopener noreferrer" aria-label={network.name}><i className={network.className}></i></a></li>
    ));
  }

  return (
    <footer>

   <div className="row">
      <div className="twelve columns">
         <ul className="social-links">
            {networks}
         </ul>

         <ul className="copyright">
            <li>&copy; Copyright 2021 Richard Hollon</li>
            <li>Design by <a title="Styleshout" href="http://www.styleshout.com/">Styleshout</a></li>
         </ul>

      </div>
      <div id="go-top"><a className="smoothscroll" title="Back to Top" href="#home" onClick={handleBackToTop}><i className="icon-up-open"></i></a></div>
   </div>
</footer>
  );
}

Footer.propTypes = {
  data: PropTypes.shape({
    social: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        className: PropTypes.string,
      })
    ),
  }),
};

export default Footer;
