import React, { useState } from "react";
import { PaymentElement, AddressElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import setNotification from "../../Common/SendNotification";
import "./Checkout.css";
import { Button } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../Slices/UserSlice";

const CheckoutForm = () => {
  const user = useAppSelector(selectUser);
  const stripe = useStripe();
  const elements = useElements();
  const [line1, setLine1] = useState<string>("");
  const [line2, setLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [submitError, setSubmitError] = useState<boolean>(false);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,

      confirmParams: {
        receipt_email: user.Email.toString(),
        return_url: "http://localhost:5173/" + user._id + "/checkoutstatus",
      },
    });
    if (error) {
      setSubmitError(true);
    }

    if (error) {
      console.log(error.message);
      let message =
        "There was an issue with your payment method. Please try again or use a different method.";
      setNotification(message, "error");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button
        disabled={!stripe}
        color="warning"
        type="submit"
        variant="contained"
        sx={{
          marginTop: "5%",
          width: "100%",
        }}
      >
        Submit Payment
      </Button>
    </form>
  );
};

export default CheckoutForm;
