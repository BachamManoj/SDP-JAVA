import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; 
import logo from '../images/Life1.png'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navigation" id="navbar" >
        <div className="container">
          <Link className="nav-link" to="/">
            <img src={logo} alt="" className="img-fluid"  />
          </Link>
          <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarmain" aria-controls="navbarmain" aria-expanded="false" aria-label="Toggle navigation">
            <span className="icofont-navigation-menu"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarmain">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
              <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/service">Services</Link></li>
             
              <li className="nav-item dropdown">
                <li><Link className="nav-link" to="/doctor">Doctor</Link></li>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
            </ul>
          </div>
          <button
            type="button"
            className="btn mr-md-2 mb-md-0 mb-2 btn-primary btn-round"
            style={{ borderRadius: '25px' ,backgroundColor:'#e12454' }}
          >
           <Link  to="/login">Login</Link>
          </button>
        </div>
        
      </nav>
    </header>
  );
}
