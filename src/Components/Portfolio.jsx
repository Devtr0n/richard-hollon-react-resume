import React from 'react';
import PropTypes from 'prop-types';

function Portfolio({ data }) {

    if(data){
      var projects = data.projects.map(function(projects){
        var projectImage = 'images/portfolio/'+projects.image;
        var projectImageWebp = projectImage.replace(/\.(jpe?g|png)$/i, '.webp');
        return <div key={projects.title} className="columns portfolio-item">
           <div className="item-wrap">
            <a href={projects.url} title={projects.title} target="_blank" rel="noopener noreferrer">
               <picture>
                  <source srcSet={projectImageWebp} type="image/webp" />
                  <img alt={projects.title} src={projectImage} loading="lazy" />
               </picture>
               <div className="overlay">
                  <div className="portfolio-item-meta">
                 <h5>{projects.title}</h5>
                     <p>{projects.category}</p>
                  </div>
                </div>
              <div className="link-icon"><i className="fa fa-link"></i></div>
            </a>
          </div>
        </div>
      })
    }

    return (
      <section id="portfolio">

      <div className="row">

         <div className="twelve columns collapsed">

            <h1>Check Out Some of My Works.</h1>

            <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                {projects}
            </div>
          </div>
      </div>
   </section>
    );
}

Portfolio.propTypes = {
  data: PropTypes.shape({
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        category: PropTypes.string,
        image: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }),
};

export default Portfolio;
