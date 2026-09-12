import React, { useState } from 'react';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

function Contact({ data }) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const fieldSetters = {
	contactName: setContactName,
	contactEmail: setContactEmail,
	contactSubject: setContactSubject,
	contactMessage: setContactMessage,
  };

  const handleChange = (event) => {
	const { name, value } = event.target;
	const setter = fieldSetters[name];
	if (setter) setter(value);
  };

  const handleSubmit = async (event) => {
	event.preventDefault();

	if (!contactName || !contactEmail || !contactMessage) {
	  setStatus('error');
	  setErrorMessage('Please fill in your name, email, and message.');
	  return;
	}

	if (!FORMSPREE_ENDPOINT) {
	  setStatus('error');
	  setErrorMessage('Contact form is not configured. Please email me directly instead.');
	  return;
	}

	setStatus('sending');
	setErrorMessage('');

	try {
	  const response = await fetch(FORMSPREE_ENDPOINT, {
		method: 'POST',
		headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({
		  name: contactName,
		  email: contactEmail,
		  subject: contactSubject,
		  message: contactMessage,
		}),
	  });

	  if (response.ok) {
		setStatus('success');
		setContactName('');
		setContactEmail('');
		setContactSubject('');
		setContactMessage('');
	  } else {
		const data = await response.json().catch(() => null);
		const message = data?.errors?.map((e) => e.message).join(', ') || 'Something went wrong sending your message.';
		setStatus('error');
		setErrorMessage(message);
	  }
	} catch (error) {
	  setStatus('error');
	  setErrorMessage('Network error. Please try again later.');
	}
  };

  if(data){
	  var message = data.contactmessage;
	}

	return (
	  <section id="contact">

		 <div className="row section-head">

			<div className="two columns header-col">

			   <h1><span>Get In Touch.</span></h1>

			</div>

			<div className="ten columns">

				  <p className="lead">{message}</p>

			</div>

		 </div>

		 <div className="row">
			<div className="twelve columns">

			   <form onSubmit={handleSubmit} id="contactForm" name="contactForm">
					<fieldset>

				  <div>
						   <label htmlFor="contactName">Name <span className="required">*</span></label>
						   <input type="text" value={contactName} size="35" id="contactName" name="contactName" onChange={handleChange} disabled={status === 'sending'}/>
				  </div>

				  <div>
						   <label htmlFor="contactEmail">Email <span className="required">*</span></label>
						   <input type="text" value={contactEmail} size="35" id="contactEmail" name="contactEmail" onChange={handleChange} disabled={status === 'sending'}/>
				  </div>

				  <div>
						   <label htmlFor="contactSubject">Subject</label>
						   <input type="text" value={contactSubject} size="35" id="contactSubject" name="contactSubject" onChange={handleChange} disabled={status === 'sending'}/>
				  </div>

				  <div>
					 <label htmlFor="contactMessage">Message <span className="required">*</span></label>
					 <textarea cols="50" rows="15" id="contactMessage" name="contactMessage" value={contactMessage} onChange={handleChange} disabled={status === 'sending'}></textarea>
				  </div>

				  <div>
					 <button className="submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Submit'}</button>
					 {status === 'sending' &&
					   <span id="image-loader">
						  <img alt="" src="images/loader.gif" />
					   </span>
					 }
				  </div>
					</fieldset>
				   </form>

		   {status === 'error' &&
			 <div id="message-warning">{errorMessage}</div>
		   }
			   {status === 'success' &&
				 <div id="message-success">
					  <i className="fa fa-check"></i>Your message was sent, thank you!<br />
				   </div>
			   }

				</div>
		 </div>
	  </section>
	);
}

export default Contact;
