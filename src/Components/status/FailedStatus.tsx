import React from "react";
import { Props } from "../../Types/Props";
import CheckoutContainer from "../checkout/CheckoutContainer";

export default function FailedStatus(props: Props) {
  return <CheckoutContainer secret={props.secret} />;
}
