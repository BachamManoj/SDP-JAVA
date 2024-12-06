import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

export default function Contact() {
  return (
    <div>
      <Navbar/>
     
      <section className="page-title bg-1">
        <div className="overlay"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="block text-center">
                <span className="text-white" style={{ fontSize: "1.2rem", opacity: 0.7 }}>Contact Us</span>
                <h1 className="text-capitalize mb-5 text-lg" style={{ fontSize: "4.2rem", opacity: 0.7 }}>Get in Touch</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section contact-info pb-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="contact-block mb-4 mb-lg-0">
                <FontAwesomeIcon icon={faPhoneAlt} size="2x" />
                <h5>Call Us</h5>
                +91 9123456780
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="contact-block mb-4 mb-lg-0">
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
                <h5>Email Us</h5>
                manoj@gmail.com
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="contact-block mb-4 mb-lg-0">
                <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
                <h5>Location</h5>
                Kl University,Vaddeswaram
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
