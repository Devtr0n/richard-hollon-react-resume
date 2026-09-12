import React from 'react';

function Footer({ data }) {
  const handleBackToTop = (e) => {
    e.preventDefault();
    document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '#home');
  };

  let networks;
  if (data) {
    networks = data.social.map((network) => (
      <li key={network.name}><a href={network.url}><i className={network.className}></i></a></li>
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

export default Footer;
