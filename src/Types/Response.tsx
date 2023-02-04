import React from "react";
import { Item } from "./Item";
import { User } from "./User";

export interface Response {
  message: string;
  user: User;
  userId: string;
  token: string;
  item: Item;
  response: Item[];
  client_secret: string;
}

export interface S3Response {
  fileUploadURL: string;
  url: string;
  status: number;
}
