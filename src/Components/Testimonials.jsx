import React from 'react';
import PropTypes from 'prop-types';

function Testimonials({ data }) {

    if(data){
      var testimonials = data.testimonials.map(function(testimonials){
        return  <li key={testimonials.user}>
            <blockquote>
               <p>{testimonials.text}</p>
               <cite>{testimonials.user}</cite>
            </blockquote>
         </li>
      })
    }

    return (
      <section id="testimonials">
      <div className="text-container">
         <div className="row">

            <div className="two columns header-col">
               <h1><span>Client Testimonials</span></h1>
            </div>

            <div className="ten columns flex-container">
                  <ul className="slides">
                      {testimonials}
                  </ul>
               </div>
            </div>
         </div>
   </section>
    );
}

Testimonials.propTypes = {
  data: PropTypes.shape({
    testimonials: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default Testimonials;
