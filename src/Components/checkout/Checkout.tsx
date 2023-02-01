import React from 'react';
import {PaymentElement} from '@stripe/react-stripe-js';
import {useStripe, useElements} from '@stripe/react-stripe-js';
import setNotification from "../../Common/SendNotification";
import "./Checkout.css";
import { Button } from '@mui/material';
import { useAppSelector } from '../../hooks';
import { selectUser } from '../../Slices/UserSlice';

const CheckoutForm = () => {
    const user = useAppSelector(selectUser);
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event: React.SyntheticEvent) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      const {error} = await stripe.confirmPayment({
        elements,
        
        confirmParams: {
          receipt_email: user.Email.toString(),
          shipping: {
            address: {
              city: "Amsterdam",
              country: "NL",
              line1: "Groen van Prinstererstraat 6/3",
              postal_code: "1051EE"
            },
            name: "David Rocker"
          },
          return_url: 'http://localhost:5173/' + user._id + '/checkoutstatus',
        },
      });
  
  
      if (error) {
        let message: string = error.message ? error.message : "Error processing payment, please try again";
        setNotification(message, "error")
      } 
    };
  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <PaymentElement />
      {//TODO add address info
      }
      <Button disabled={!stripe} color="warning" type="submit" variant="contained" sx={{
          marginTop: "5%",
          width: "100%"
      }}>Submit Payment</Button>
    </form>
  );
};

export default CheckoutForm;