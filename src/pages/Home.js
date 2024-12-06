import React from 'react';
import './Navbar.css';
import { Link,useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NotebookPen,BriefcaseBusiness,Ambulance } from 'lucide-react';
import img1 from '../images/img-1.jpg';
import img2 from '../images/img-2.jpg';
import img3 from '../images/img-3.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTooth ,faCrutch, faDna, faBrain ,faHeartPulse, faFlask } from '@fortawesome/free-solid-svg-icons';



import './Home.css'; 
import Navbar from './Navbar';

export default function Home() {
  return (
    <div>
      <Navbar/>
      <section className="banner" style={{ marginBottom: '90px' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-xl-7">
              <div className="block text-left">
                <div className="divider mb-3"></div>
                <span className="text-uppercase text-sm letter-spacing">
                  Total Health care solution
                </span>
                <h1 className="mb-3 mt-3">Your Most Trusted Health Partner</h1>

                <p className="mb-4 pr-5">
                Rejecting what doesn't matter and focusing on what's truly important, appreciating the good things, avoiding harm, and working towards what we value.
                </p>
                <div className="btn-container">
                  <a
                    className="btn btn-main-2 btn-icon btn-round-full"
                    rel="noreferrer"
                  >
                   <Link className="nav-link" to="/patientlogin"> Make Appointment</Link>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        
      <section className="features" >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="feature-block d-lg-flex">
                <div className="feature-item mb-5 mb-lg-0">
                  <div className="feature-icon mb-4">
                    <i className="icofont-surgeon-alt"></i>
                    <NotebookPen size={36} strokeWidth={1.5} />
                  </div>
                  
                  <span>24 Hours Service</span>
                  <h4 className="mb-3">Online Appointment</h4>
                  <p className="mb-4">
                    Get all-time support for emergencies. We have introduced the
                    principle of family medicine.
                  </p>
                  <Link className="btn btn-main btn-round-full" to="/patientlogin"> Make Appointment</Link>
                </div>

                <div className="feature-item mb-5 mb-lg-0">
                  <div className="feature-icon mb-4">
                    <i className="icofont-ui-clock"></i>
                    <BriefcaseBusiness size={36} strokeWidth={1.5} />
                  </div>
                  <span>Timing Schedule</span>
                  <h4 className="mb-3">Working Hours</h4>
                  <ul className="w-hours list-unstyled">
                    <li className="d-flex justify-content-between">
                      Sun - Wed : <span>8:00 - 17:00</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      Thu - Fri : <span>9:00 - 17:00</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      Sat - Sun : <span>10:00 - 17:00</span>
                    </li>
                  </ul>
                </div>

                <div className="feature-item mb-5 mb-lg-0">
                  <div className="feature-icon mb-4">
                    <i className="icofont-support"></i>
                    <Ambulance size={36} strokeWidth={1.5} />
                  </div>
                  <span>Emergency Cases</span>
                  <h4 className="mb-3">1-800-700-6200</h4>
                  <p>
                    Get all-time support for emergencies. We have introduced the
                    principle of family medicine. Get connected with us for any
                    urgency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 col-sm-6">
              <div className="about-img">
                <img src={img1} alt="" className="img-fluid" />
                <img src={img2} alt="" className="img-fluid mt-4" />
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="about-img mt-4 mt-lg-0">
                <img src={img3} alt="" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="about-content pl-4 mt-4 mt-lg-0">
                <h2 className="title-color">Personal care <br />& healthy living</h2>
                <p className="mt-4 mb-5">
                We provide the best leading medical service, with unparalleled care and expertise. Our services are backed by a commitment to excellence and a dedication to patient satisfaction.
                </p>
                
                <Link className="btn btn-main-2 btn-round-full btn-icon" to="/service">Services</Link>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta position-relative">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="counter-stat">
                  <i className="icofont-doctor"></i>
                  <span className="h3">58</span>k
                  <p>Happy People</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="counter-stat">
                  <i className="icofont-flag"></i>
                  <span className="h3">700</span>+
                  <p>Surgery Completed</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="counter-stat">
                  <i className="icofont-badge"></i>
                  <span className="h3">40</span>+
                  <p>Expert Doctors</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="counter-stat">
                  <i className="icofont-globe"></i>
                  <span className="h3">20</span>
                  <p>Worldwide Branch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section service gray-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center">
              <div className="section-title">
                <h2>Award-winning patient care</h2>
                <div className="divider mx-auto my-4"></div>
                <p>
                  Let's know more about the necessary steps to ensure quality care.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="service-item mb-4">
                <div className="icon d-flex align-items-center">
                <FontAwesomeIcon icon={faFlask} size="2x" color="#5a67d8" />
                  <h4 className="mt-3 mb-3">Laboratory Services</h4>
                </div>
                <div className="content">
                  <p className="mb-4">We provide comprehensive laboratory services for accurate diagnoses.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="service-item mb-4">
                <div className="icon d-flex align-items-center">
                
                <FontAwesomeIcon icon={faHeartPulse} size="2x" color="#5a67d8" />
                  <h4 className="mt-3 mb-3">Heart Disease</h4>
                </div>
                <div className="content">
                  <p className="mb-4">Expert care and advanced treatments for heart-related conditions.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="service-item mb-4">
                <div className="icon d-flex align-items-center">
                  <i className="icofont-tooth text-lg"></i>
                  <FontAwesomeIcon icon={faTooth} size="2x" color="#5a67d8" />
                  <h4 className="mt-3 mb-3">Dental Care</h4>
                </div>
                <div className="content">
                  <p className="mb-4">Comprehensive dental services for a healthy smile.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="service-item mb-4">
                <div className="icon d-flex align-items-center">
                <FontAwesomeIcon icon={faCrutch} size="2x" color="#5a67d8" />
                  <h4 className="mt-3 mb-3">Body Surgery</h4>
                </div>
                <div className="content">
                  <p className="mb-4">Advanced surgical care to help you recover and thrive.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="service-item mb-4">
                <div className="icon d-flex align-items-center">
                  <FontAwesomeIcon icon={faBrain} size="2x" color="#5a67d8" />
                  <h4 className="mt-3 mb-3">Neurology Surgery</h4>
                </div>
                <div className="content">
                  <p className="mb-4">Specialized neurological care for complex conditions.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="service-item mb-4">
                <div className="icon d-flex align-items-center">
                <FontAwesomeIcon icon={faDna} size="2x" color="#5a67d8" />
                  <h4 className="mt-3 mb-3">Gynecology</h4>
                </div>
                <div className="content">
                  <p className="mb-4">Comprehensive care for women's health.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>





    </div>
  );
}

