import React, { useState, useEffect } from "react";
import PatientDashboard from "./PatientDashboard";
import api from "../api/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faBoxOpen, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusIndex, setActiveStatusIndex] = useState(null);

  useEffect(() => {
    api.get("/getOrdersbyPatient")  // ✔ JWT automatically added
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusText = (order) =>
    order.delivered ? "Delivered" :
    order.inTransit ? "In Transit" :
    order.dispatched ? "Dispatched" : "Unknown";

  const getStatusClass = (order) =>
    order.delivered
      ? "bg-success"
      : order.inTransit
      ? "bg-warning text-dark"
      : order.dispatched
      ? "bg-info"
      : "bg-secondary";

  const renderStages = (order) => {
    const stages = [
      { label: "Dispatched", icon: faTruck, active: order.dispatched },
      { label: "In Transit", icon: faBoxOpen, active: order.inTransit },
      { label: "Delivered", icon: faCheckCircle, active: order.delivered },
    ];

    return (
      <div className="row mt-3">
        <div className="col-12 d-flex justify-content-between">
          {stages.map((stage, i) => (
            <div key={i} className="text-center stage">
              <FontAwesomeIcon icon={stage.icon} size="2x" className={stage.active ? "text-success" : "text-muted"} />
              <div className={stage.active ? "text-success mt-1" : "text-muted mt-1"}>{stage.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />

      <div className="container" style={{ marginTop: 80 }}>
        <div className="alert alert-primary text-center shadow-sm">
          <h2>My Orders</h2>
          <p>Track delivery status of your ordered medicines</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info text-center">No orders found</div>
        ) : (
          <table className="table table-striped shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Order Date</th>
                <th>Address</th>
                <th>Status</th>
                <th>Track</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>{order.address}</td>
                    <td>
                      <span className={`badge ${getStatusClass(order)}`}>
                        {getStatusText(order)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          setActiveStatusIndex(activeStatusIndex === index ? null : index)
                        }
                      >
                        {activeStatusIndex === index ? "Hide" : "Track"}
                      </button>
                    </td>
                  </tr>

                  {activeStatusIndex === index && (
                    <tr>
                      <td colSpan="5">{renderStages(order)}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>
        {`
          .stage {
            width: 30%;
          }
        `}
      </style>
    </div>
  );
};

export default MyOrders;
