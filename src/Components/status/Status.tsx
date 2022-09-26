import { Container, Paper, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import setNotification from "../../Common/SendNotification";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import DisplayStatus from "./DisplayStatus";
import SuccessStatus from "./SuccessStatus";
import ProcessingStatus from "./ProcessingStatus";

export default function Status() {
  const stripe = useStripe();
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    console.log(clientSecret);
    if (clientSecret) {
      setIsLoading(true);
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        console.log(paymentIntent);

        if (paymentIntent) {
          switch (paymentIntent.status) {
            case "succeeded":
            case "processing":
              setPaymentStatus(paymentIntent.status);
              break;

            case "requires_payment_method":
              setNotification(
                "Error with the payment method, please try again",
                "error"
              );
              // Redirect your user back to your payment page to attempt collecting
              // payment again
              //setMessage("Payment failed. Please try another payment method.");
              break;

            default:
              setNotification(
                "Error processing the payment, please try again",
                "error"
              );
              //setMessage("Something went wrong.");
              break;
          }
        }
      });
    }
  }, [stripe]);

  useEffect(() => {
    setIsLoading(false);
    console.log("rendering");
  }, [paymentStatus]);

  const renderStatus = (
    <Container>
      {paymentStatus === "succeeded" && (
            <SuccessStatus />
      )}
        {paymentStatus === "processing" && (
            <ProcessingStatus />
        )}
      {paymentStatus === "requires_payment_method" && (
        <DisplayStatus status={paymentStatus} />
      )}
    </Container>
  );
  return <div>{isLoading ? <LoadingSpinner /> : renderStatus}</div>;
}
