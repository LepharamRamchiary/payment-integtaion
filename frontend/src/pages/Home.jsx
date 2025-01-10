import axios from "axios";
import { useState } from "react";
import {useRazorpay} from "react-razorpay";
// console.log(useRazorpay);


export const Home = ()=>{

    const Razorpay = useRazorpay();
    const [amount, setAmount] = useState(500);
  
    // complete order
    const complete_order = (paymentID, orderID, signature)=>{
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/razorpay/order/complete/',
            data: {
                "payment_id": paymentID,
                "order_id": orderID,
                "signature": signature,
                "amount": amount
            }
        })
        .then((response)=>{
            console.log(response.data);
        })
        .catch((error)=>{
            console.log(error.response.data);
        })
    }

    const razorPay = () => {
        // First, create an order
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/razorpay/order/create/',
            data: {
                amount: amount * 100, // Razorpay expects amount in paise
                currency: "INR"
            }
        })
        .then((response) => {
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: amount * 100, // Should match the amount from create order
                currency: "INR",
                name: "Acme Corp",
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                order_id: response.data.data.id,
                handler: function (response) {
                    complete_order(
                        response.razorpay_payment_id,
                        response.razorpay_order_id,
                        response.razorpay_signature
                    );
                },
                prefill: {
                    name: "Piyush Garg",
                    email: "youremail@example.com",
                    contact: "9999999999",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const paymentObject = new Razorpay(options);
            paymentObject.open();
        })
        .catch((error) => {
            console.error('Error:', error.response?.data || error);
        });
    };

    return(
        <div className="container mt-5 text-center rounded bg-warning border p-5" style={{width:"28%"}}>
            <h1 className="fw-bolder display-2">₹500</h1>
            <p>per year</p>
            <div>
                <h3 className="fw-semibold">Basic</h3>
                <div className="text-start mt-3">
                    <ul style={{fontSize:"14px"}}>
                        <li>1 custom domain e.g. img.yourdomain.com</li>
                        <li>Media library backup</li>
                        <li>Automated image analysis reports with Performance Center</li>
                        <li>One-time 30 minute consultation with a media optimization expert</li>
                        <li>Live chat & 12-hr SLA support tickets</li>
                        <li>5 user accounts with role-based permissions</li>
                    </ul>
                </div>
                <div className="d-grid mt-3">
                    <button type="button" className="btn btn-light fw-semibold py-3" onClick={razorPay}>Upgrad now</button>
                </div>
            </div>
        </div>
    )
}
