import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";
import { Link } from "react-router-dom";
import api from "../api/apiClient";

const PharmacistHomePage = () => {
  const [orderCounts, setOrderCounts] = useState({
    delivered: 0,
    inTransit: 0,
    dispatched: 0,
  });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get("/getAllOrders", { withCredentials: true });

        const orders = res.data;

        setOrderCounts({
          delivered: orders.filter((o) => o.delivered).length,
          inTransit: orders.filter((o) => o.inTransit).length,
          dispatched: orders.filter((o) => o.dispatched).length,
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="dashboard-container d-flex">
      <PharmacistDashboard />

      <div className="container" style={{ marginTop: 75 }}>
        <div className="alert alert-primary text-center shadow-sm">
          <h2>Pharmacist Home Page</h2>
          <p>Welcome to the pharmacist portal. Manage and track orders efficiently!</p>
        </div>

        <div className="row text-center mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h6>Orders Delivered</h6>
              </div>
              <div className="card-body">
                <h3>{orderCounts.delivered}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-white">
                <h6>Orders In Transit</h6>
              </div>
              <div className="card-body">
                <h3>{orderCounts.inTransit}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h6>Orders Dispatched</h6>
              </div>
              <div className="card-body">
                <h3>{orderCounts.dispatched}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-info text-white">
                <h5>Track Orders</h5>
              </div>
              <div className="card-body">
                <p>
                  View all patient orders and update the status to <strong>Dispatched</strong>,{" "}
                  <strong>In Transit</strong>, or <strong>Delivered</strong>.
                </p>

                <Link to="/trackOrder" className="btn btn-info w-100 text-white">
                  Track Orders
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-success text-white">
                <h5>Payment Management</h5>
              </div>
              <div className="card-body">
                <p>Verify payments and mark prescription-based orders as confirmed.</p>

                <Link
                  to="/viewPaymentsByEPharmacist"
                  className="btn btn-success w-100 text-white"
                >
                  View Payments
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PharmacistHomePage;
