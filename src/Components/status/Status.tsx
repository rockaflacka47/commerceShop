import { Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import setNotification from "../../Common/SendNotification";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import SuccessStatus from "./SuccessStatus";
import { useAppSelector } from "../../hooks";
import { selectUser, setUser } from "../../Slices/UserSlice";
import { api } from "../../Api/api";
import { useAppDispatch } from "../../hooks";
import { Address } from "../../Types/Address";
import FailedStatus from "./FailedStatus";

export default function Status() {
  const stripe = useStripe();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [address, setAddress] = useState<Address>();

  let clientSecret;

  useEffect(() => {
    if (!stripe) {
      return;
    }
    clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (clientSecret) {
      setIsLoading(true);
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (user.Email === "") {
          if (paymentIntent?.receipt_email) {
            api.DoLoginEmail(paymentIntent.receipt_email).then((val) => {
              dispatch(setUser(val.user));
            });
          }
        }

        if (paymentIntent) {
          switch (paymentIntent.status) {
            case "succeeded":
              //@ts-ignore
              setAddress(paymentIntent.shipping);
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
  }, [paymentStatus]);

  const renderStatus = (
    <Container>
      {paymentStatus === "succeeded" && <SuccessStatus address={address} />}
      {paymentStatus === "requires_payment_method" && (
        <FailedStatus secret={clientSecret} />
      )}
    </Container>
  );
  return <div>{isLoading ? <LoadingSpinner /> : renderStatus}</div>;
}
