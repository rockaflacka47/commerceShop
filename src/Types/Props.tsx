import React from "react";
import { Address } from "./Address";

export interface Props {
  secret?: string;
  status?: string;
  id?: string;
  img_url?: string;
  name?: string;
  address?: Address;
}
