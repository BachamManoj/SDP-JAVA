import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";
import api from "../api/apiClient";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderPrices, setOrderPrices] = useState({});
  const [ePrescriptions, setEPrescriptions] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------------
  // Fetch Orders
  // ----------------------------
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/getAllOrders");

      const unaccepted = res.data.filter((order) => !order.accept);
      setOrders(unaccepted);

      // Fetch prices for each order
      const prices = {};
      await Promise.all(
        unaccepted.map(async (order) => {
          try {
            const priceRes = await api.get(
              `/getPriceOfOrder/${order.appointment.id}`
            );
            prices[order.id] = priceRes.data;
          } catch {
            prices[order.id] = "Error";
          }
        })
      );
      setOrderPrices(prices);

    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Fetch E-Prescription Items
  // ----------------------------
  const fetchEPrescriptions = async (appointmentId) => {
    try {
      const res = await api.get(
        `/checkMedicinesAcceptOrder/${appointmentId}`
      );

      setEPrescriptions(res.data);
      setSelectedAppointment(appointmentId);
    } catch (err) {
      setError("Failed to load ePrescription items.");
    }
  };

  // ----------------------------
  // Confirm Accept Order
  // ----------------------------
  const confirmAcceptOrder = async (appointmentId) => {
    try {
      await api.post(`/acceptOrder/${appointmentId}`);

      alert("Order accepted successfully!");

      setOrders((prev) =>
        prev.map((order) =>
          order.appointment.id === appointmentId
            ? { ...order, accept: true }
            : order
        )
      );

      setSelectedAppointment(null);
      setEPrescriptions([]);

    } catch (err) {
      setError("Failed to accept order.");
    }
  };

  // ----------------------------
  // Loading UI
  // ----------------------------
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  // ----------------------------
  // MAIN UI
  // ----------------------------
  return (
    <div className="dashboard-container d-flex">
      <PharmacistDashboard />

      <div className="container" style={{ marginTop: 75 }}>
        <div className="alert alert-info text-center">
          <h2>New Orders</h2>
        </div>

        {orders.length > 0 ? (
          <div className="card shadow-sm">
            <div className="card-body">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Order Date</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr>
                        <td>{order.id}</td>
                        <td>{order.appointment.patient.firstName}</td>
                        <td>{order.address}</td>

                        <td>
                          {orderPrices[order.id] === "Error"
                            ? "Error fetching price"
                            : orderPrices[order.id] !== undefined
                            ? `₹${orderPrices[order.id].toFixed(2)}`
                            : "Loading..."}
                        </td>

                        <td>
                          {new Date(order.orderDate).toLocaleString()}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              order.isPaid ? "bg-success" : "bg-warning"
                            }`}
                          >
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-info btn-sm mb-1"
                            onClick={() =>
                              fetchEPrescriptions(order.appointment.id)
                            }
                          >
                            View Medicines
                          </button>

                          {selectedAppointment === order.appointment.id && (
                            <button
                              className="btn btn-success btn-sm mt-1"
                              onClick={() =>
                                confirmAcceptOrder(order.appointment.id)
                              }
                            >
                              Confirm Accept
                            </button>
                          )}
                        </td>
                      </tr>

                      {selectedAppointment === order.appointment.id &&
                        ePrescriptions.length > 0 && (
                          <tr>
                            <td colSpan="7">
                              <div className="card shadow">
                                <div className="card-header bg-primary text-white text-center">
                                  <strong>Medicines in Order</strong>
                                </div>

                                <ul className="list-group list-group-flush">
                                  {ePrescriptions.map((med, index) => (
                                    <li
                                      key={index}
                                      className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                      {med.medicine.name}
                                      <span className="badge bg-secondary">
                                        Qty: {med.quantity}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center">No new unaccepted orders.</p>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;
