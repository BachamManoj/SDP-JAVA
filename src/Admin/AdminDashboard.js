import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white">
        <h3 className="sidebar-header text-center py-4">Admin Dashboard</h3>
        <ul className="nav flex-column px-3">
          <li className="nav-item my-2">
            <Link to="/adminpage" className="nav-link text-white">
              Dashboard
            </Link>
          </li>
          <li className="nav-item my-2">
            <Link to="/managePatients" className="nav-link text-white">
              Manage Patinets
            </Link>
          </li>
          <li className="nav-item my-2">
            <Link to="/manageDoctor" className="nav-link text-white">
              Manage Doctor
            </Link>
          </li>
          <li className="nav-item my-2">
            <Link to="/managePharmacist" className="nav-link text-white">
            Manage Pharmacist
            </Link>
          </li>
          
          <li className="nav-item my-2">
            <Link to="/" className="nav-link text-white">
              Logout
            </Link>
          </li>
        </ul>
      </div>
      {/* Placeholder for main content */}
    </div>
  );
}

export default AdminDashboard;
