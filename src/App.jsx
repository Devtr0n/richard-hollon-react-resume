import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import About from './Components/About';
import Resume from './Components/Resume';
import Contact from './Components/Contact';
import Testimonials from './Components/Testimonials';
import Portfolio from './Components/Portfolio';

function App() {
  const [resumeData, setResumeData] = useState({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch('/resumeData.json', { cache: 'no-cache' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then(data => setResumeData(data))
      .catch(err => {
        console.error(err);
        setLoadError(true);
      });
  }, []);

  if (loadError) {
    return (
      <div className="App">
        <div role="alert" className="load-error">
          <p>Sorry, something went wrong loading this page. Please try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <a className="skip-link" href="#about">Skip to main content</a>
      <Header data={resumeData.main}/>
      <About data={resumeData.main}/>
      <Resume data={resumeData.resume}/>
      <Portfolio data={resumeData.portfolio}/>
      <Testimonials data={resumeData.testimonials}/>
      <Contact data={resumeData.main}/>
      <Footer data={resumeData.main}/>
    </div>
  );
}

export default App;
