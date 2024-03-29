import React from "react";
import { Review } from "./Review";

export interface Item {
  Name: string;
  Description: String;
  Price: number;
  Img_url: string;
  Sold: Number;
  _id: string;
  Alternate_pictures: String[];
  Reviews: Review[];
}
