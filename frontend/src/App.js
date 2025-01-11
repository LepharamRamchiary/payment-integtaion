import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useRazorpay } from "react-razorpay";

function App() {
  const [amount] = useState(500);
  const { Razorpay } = useRazorpay();

  const complete_payment = async (payment_id, order_id, signature) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/razorpay/order/complete/",
        {
          payment_id,
          order_id,
          signature,
          amount,
        }
      );
      console.log("Payment completed successfully:", response.data);
    } catch (error) {
      console.error("Payment completion error:", error.response?.data || error);
    }
  };
  

  const razorpayPayment = async () => {
    try {
      // Convert amount to paise (smallest currency unit)
      const amountInPaise = amount * 100;

      const response = await axios.post(
        "http://127.0.0.1:8000/razorpay/order/create/",
        {
          amount: amountInPaise,
          currency: "INR",
        }
      );

      const order_id = response.data.data.id;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        name: "Test Company",
        description: "Test Transaction",
        order_id: order_id,
        handler: function (response) {
          complete_payment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        },
        prefill: {
          name: "Lepharam Ramchiary",
          email: "john.doe@example.com",
          contact: "9101318307",
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
          },
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //   </Routes>
    // </BrowserRouter>
    <div
      className="container mt-5 rounded p-5 bg-warning shadow"
      style={{ width: "28%" }}
    >
      <h1 className="text-center fw-bold display-3">$500</h1>
      <p className="text-center">per year</p>
      <h3 className="fw-semibold text-center">Basic</h3>
      <div className="mt-3 d-grid">
        <button
          type="button"
          onClick={razorpayPayment}
          className="btn btn-light py-3 fw-semibold"
        >
          Upgrade now
        </button>
      </div>
    </div>
  );
}

export default App;
