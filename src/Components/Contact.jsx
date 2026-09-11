import React, { Component } from 'react';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

class Contact extends Component {
  constructor(props) {
	super(props);
	this.state = {
	  contactName: '',
	  contactEmail: '',
	  contactSubject: '',
	  contactMessage: '',
	  status: 'idle', // idle | sending | success | error
	  errorMessage: '',
	};

	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
	const { name, value } = event.target;
	this.setState({ [name]: value });
  }

  async handleSubmit(event) {
	event.preventDefault();

	const { contactName, contactEmail, contactSubject, contactMessage } = this.state;

	if (!contactName || !contactEmail || !contactMessage) {
	  this.setState({ status: 'error', errorMessage: 'Please fill in your name, email, and message.' });
	  return;
	}

	if (!FORMSPREE_ENDPOINT) {
	  this.setState({
		status: 'error',
		errorMessage: 'Contact form is not configured. Please email me directly instead.',
	  });
	  return;
	}

	this.setState({ status: 'sending', errorMessage: '' });

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
		this.setState({
		  status: 'success',
		  contactName: '',
		  contactEmail: '',
		  contactSubject: '',
		  contactMessage: '',
		});
	  } else {
		const data = await response.json().catch(() => null);
		const message = data?.errors?.map((e) => e.message).join(', ') || 'Something went wrong sending your message.';
		this.setState({ status: 'error', errorMessage: message });
	  }
	} catch (error) {
	  this.setState({ status: 'error', errorMessage: 'Network error. Please try again later.' });
	}
  }

  render() {

	if(this.props.data){
	  var name = this.props.data.name;
	  var street = this.props.data.address.street;
	  var city = this.props.data.address.city;
	  var state = this.props.data.address.state;
	  var zip = this.props.data.address.zip;
	  var phone= this.props.data.phone;
	  var message = this.props.data.contactmessage;
	}

	const { contactName, contactEmail, contactSubject, contactMessage, status, errorMessage } = this.state;

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
			<div className="eight columns">

			   <form onSubmit={this.handleSubmit} id="contactForm" name="contactForm">
					<fieldset>

				  <div>
						   <label htmlFor="contactName">Name <span className="required">*</span></label>
						   <input type="text" value={contactName} size="35" id="contactName" name="contactName" onChange={this.handleChange} disabled={status === 'sending'}/>
				  </div>

				  <div>
						   <label htmlFor="contactEmail">Email <span className="required">*</span></label>
						   <input type="text" value={contactEmail} size="35" id="contactEmail" name="contactEmail" onChange={this.handleChange} disabled={status === 'sending'}/>
				  </div>

				  <div>
						   <label htmlFor="contactSubject">Subject</label>
						   <input type="text" value={contactSubject} size="35" id="contactSubject" name="contactSubject" onChange={this.handleChange} disabled={status === 'sending'}/>
				  </div>

				  <div>
					 <label htmlFor="contactMessage">Message <span className="required">*</span></label>
					 <textarea cols="50" rows="15" id="contactMessage" name="contactMessage" value={contactMessage} onChange={this.handleChange} disabled={status === 'sending'}></textarea>
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

				<aside className="four columns footer-widgets">
			   <div className="widget widget_contact">

					   <h4>Address and Phone</h4>
					   <p className="address">
						   {name}<br />
						   {street} <br />
						   {city}, {state} {zip}<br />
						   <span>{phone}</span>
					   </p>
				   </div>
			</aside>
		 </div>
	  </section>
	);
  }
}

export default Contact;
