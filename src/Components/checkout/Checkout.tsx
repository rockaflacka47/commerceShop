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
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      const {error} = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
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
      <Button disabled={!stripe} color="warning" type="submit" variant="contained" sx={{
          marginTop: "5%",
          width: "100%"
      }}>Submit Payment</Button>
    </form>
  );
};

export default CheckoutForm;