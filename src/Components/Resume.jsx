import React from 'react';
import PropTypes from 'prop-types';

function Resume({ data }) {
    const skillmessage = data?.skillmessage;
    const education = data?.education.map(function(education){
        return <div key={education.school}><h3>{education.school}</h3>
        <p className="info">{education.degree} <span>&bull;</span><em className="date">{education.graduated}</em></p>
        <p>{education.description}</p></div>
      })
    const work = data?.work.map(function(work){
        return <div key={work.company}><h3>{work.company}</h3>
            <p className="info">{work.title}<span>&bull;</span> <em className="date">{work.years}</em></p>
            <p>{work.description}</p>
        </div>
      })
    const skillCategories = data?.skills.map(function(category){
        const skills = category.skills.map(function(skill){
            const slug = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const className = 'bar-expand '+slug;
            const levelValue = parseInt(skill.level, 10);
            const labelId = 'skill-label-' + slug;
            return <li key={skill.name}>
                <em id={labelId}>{skill.name}</em>
                <div
                  className="bar-track"
                  role="progressbar"
                  aria-labelledby={labelId}
                  aria-valuenow={levelValue}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuetext={skill.level}
                >
                  <span className={className} style={{ '--skill-level': skill.level }}>
                    <span className="skill-percent" aria-hidden="true">{skill.level}</span>
                  </span>
                </div>
              </li>
          })
        return <div className="skill-category" key={category.category}>
            <h3>{category.category}</h3>
            <ul className="skills">
              {skills}
            </ul>
          </div>
      })

    return (
      <section id="resume">

      <div className="row education">
         <div className="three columns header-col">
            <h2><span>Education</span></h2>
         </div>

         <div className="nine columns main-col">
            <div className="row item">
               <div className="twelve columns">
                 {education}
               </div>
            </div>
         </div>
      </div>


      <div className="row work">

         <div className="three columns header-col">
            <h2><span>Recent Work</span></h2>
         </div>

         <div className="nine columns main-col">
          {work}
        </div>
    </div>



      <div className="row skill">

         <div className="three columns header-col">
            <h2><span>Skills</span></h2>
         </div>

         <div className="nine columns main-col">

            <p>{skillmessage}
            </p>

				<div className="bars skill-categories">
				   {skillCategories}
				</div>
			</div>
	  </div>
   </section>
	);
}

Resume.propTypes = {
  data: PropTypes.shape({
    skillmessage: PropTypes.string,
    education: PropTypes.arrayOf(
      PropTypes.shape({
        school: PropTypes.string.isRequired,
        degree: PropTypes.string,
        graduated: PropTypes.string,
        description: PropTypes.string,
      })
    ),
    work: PropTypes.arrayOf(
      PropTypes.shape({
        company: PropTypes.string.isRequired,
        title: PropTypes.string,
        years: PropTypes.string,
        description: PropTypes.string,
      })
    ),
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string.isRequired,
        skills: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            level: PropTypes.string,
          })
        ),
      })
    ),
  }),
};

export default Resume;
