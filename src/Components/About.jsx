import React from 'react';
import PropTypes from 'prop-types';

function About({ data }) {
  const profilepic = data ? "images/"+data.image : undefined;
  const profilepicWebp = profilepic ? profilepic.replace(/\.(jpe?g|png)$/i, '.webp') : undefined;
  const bio = data?.bio;
  const city = data?.address?.city;
  const state = data?.address?.state;
  const phone = data?.phone;
  const email = data?.email;
  const study = data?.study;
  const interests = data?.interests;
  const employment = data?.employment;
  const resumeDownload = data?.resumedownload;

  return (
      <section id="about">
      <div className="row">
         <div className="three columns">
            <picture>
               <source srcSet={profilepicWebp} type="image/webp" />
               <img className="profile-pic" src={profilepic} alt="Richard Hollon Profile Pic" />
            </picture>
         </div>
         <div className="nine columns main-col">
            <h2>About Me</h2>

            <p>{bio}</p>
            <div className="row about-info-list">
               <div className="six columns">
                  <ul className="info-list">
                     <li><i className="fa fa-map-marker"></i><strong>Location:</strong> {city}, {state}</li>
                     <li><i className="fa fa-book"></i><strong>Study:</strong> {study}</li>
                     <li><i className="fa fa-briefcase"></i><strong>Employment:</strong> {employment}</li>
                  </ul>
               </div>
               <div className="six columns">
                  <ul className="info-list">
                     <li><i className="fa fa-star"></i><strong>Interests:</strong> {interests}</li>
                     <li><i className="fa fa-phone"></i><strong>Phone:</strong> {phone}</li>
                     <li><i className="fa fa-envelope"></i><strong>Email:</strong> {email}</li>
                  </ul>
               </div>
            </div>
			<div className="row">
			   <div className="columns download">
				  <p>
					 <a href={resumeDownload} className="button"><i className="fa fa-download"></i>Download Resume</a>
				  </p>
			   </div>
			</div>
         </div>
      </div>

   </section>
    );
}

About.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.string,
    bio: PropTypes.string,
    address: PropTypes.shape({
      city: PropTypes.string,
      state: PropTypes.string,
    }),
    phone: PropTypes.string,
    email: PropTypes.string,
    study: PropTypes.string,
    interests: PropTypes.string,
    employment: PropTypes.string,
    resumedownload: PropTypes.string,
  }),
};

export default About;
