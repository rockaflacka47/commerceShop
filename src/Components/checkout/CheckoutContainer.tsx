import React from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./Checkout";
import { Paper } from "@mui/material";
import { Props } from "../../Types/Props";
import Status from "../status/Status";

const stripePromise = loadStripe(
  "pk_test_51LjME3JcZKN8LlIMTSebeaKaBQkBm8Lqid5d9oLGIJD8OBj18LF3DExPjjV3m1CiVqDXlo1W3iBVy1cUGegN6oSB00MLg9jWmm"
);

export default function CheckoutContainer(props: Props) {
  const options = {
    clientSecret: props.secret
      ? props.secret
      : new URLSearchParams(window.location.search).get(
          "payment_intent_client_secret"
        ),
    appearance: {
      theme: "flat",
      labels: "floating",
      variables: {
        colorText: "#c85a54",
      },
    },
  };

  return (
    //@ts-ignore
    <Elements stripe={stripePromise} options={options}>
      {props.secret && (
        <Paper
          sx={{
            position: "fixed",
            left: "25%",
            top: "12.5%",
            width: "50%",
            overflow: "scroll",
            height: "75%",
            zIndex: "150",
            display: "flex",
          }}
        >
          <CheckoutForm />
        </Paper>
      )}
      {!props.secret && <Status />}
    </Elements>
  );
}
