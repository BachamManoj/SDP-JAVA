import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import service1 from '../images/service-1.jpg'
import service2 from '../images/service-2.jpg'
import service3 from '../images/service-3.jpg'
import service4 from '../images/service-4.jpg'
import service6 from '../images/service-6.jpg'
import service8 from '../images/service-8.jpg'
import { Link,useNavigate } from 'react-router-dom';
import './Navbar.css';
import Navbar from './Navbar';

export default function Service() {
  return (
    <div>
		<Navbar/>
      <section className="page-title bg-1">
        <div className="overlay"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="block text-center">
                <span className="text-white" style={{ fontSize: "1.2rem", opacity: 0.7 }}>Our Services</span>
                <h1 className="text-capitalize mb-5 text-lg" style={{ fontSize: "4.2rem", opacity: 0.7 }}>What we do</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section service-2">
	<div className="container">
		<div className="row">
			<div className="col-lg-4 col-md-6 col-sm-6">
				<div className="service-block mb-5">
					<img src={service1} alt="" className="img-fluid"/>
					<div className="content">
						<h4 className="mt-4 mb-2 title-color">Child care</h4>
						<p className="mb-4">Providing specialized medical care tailored to the unique needs of children.</p>
					</div>
				</div>
			</div>

			<div className="col-lg-4 col-md-6 col-sm-6">
				<div className="service-block mb-5">
					<img src={service2} alt="" className="img-fluid"/>
					<div className="content">
						<h4 className="mt-4 mb-2  title-color">Personal Care</h4>
						<p className="mb-4">Offering compassionate and personalized care to enhance daily living and well-being.</p>
					</div>
				</div>
			</div>
			
			<div className="col-lg-4 col-md-6 col-sm-6">
				<div className="service-block mb-5">
					<img src={service3} alt="" className="img-fluid"/>
					<div className="content">
						<h4 className="mt-4 mb-2 title-color">CT scan</h4>
						<p className="mb-4">Delivering precise imaging with state-of-the-art CT scan technology.</p>
					</div>
				</div>
			</div>


			<div className="col-lg-4 col-md-6 col-sm-6">
				<div className="service-block mb-5 mb-lg-0">
					<img src={service4} alt="" className="img-fluid"/>
					<div className="content">
						<h4 className="mt-4 mb-2 title-color">Joint replacement</h4>
						<p className="mb-4">Specializing in advanced joint replacement surgeries to restore mobility.</p>
					</div>
				</div>
			</div>

			<div className="col-lg-4 col-md-6 col-sm-6">
				<div className="service-block mb-5 mb-lg-0">
					<img src={service6} alt="" className="img-fluid"/>
					<div className="content">
						<h4 className="mt-4 mb-2 title-color">Examination & Diagnosis</h4>
						<p className="mb-4">Comprehensive medical examinations for accurate diagnosis and treatment.</p>
					</div>
				</div>
			</div>
			
			<div className="col-lg-4 col-md-6 col-sm-6">
				<div className="service-block mb-5 mb-lg-0">
					<img src={service8} alt="" className="img-fluid"/>
					<div className="content">
						<h4 className="mt-4 mb-2 title-color">Alzheimer's disease</h4>
						<p className="mb-4">Providing expert diagnosis and compassionate care for Alzheimer's patients.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
      <section className="section cta-page ">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="cta-content">
                <div className="divider mb-4"></div>
                <h2 className="mb-5 text-lg">
                  We are pleased to offer you the <span className="title-color">chance to have the healthy</span>
                </h2>
				<Link className="btn btn-main-2 btn-round-full" to="/patientlogin">               
                  Get appointment <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
				</Link>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
