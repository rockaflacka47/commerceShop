import React from "react";
import { Item } from "../Types/Item";
import { Response, S3Response } from "../Types/Response";
import { User } from "../Types/User";
import { userItem } from "../Types/UserItem";

export const api = {
  //Description: Returns list of paginated items listed
  //Request Type: POST
  //Parameters:
  //page: number
  GetItems: function (page: Number): Promise<void | Item[]> {
    let ret: Item[];
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/GetPaginatedItems",
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
           Page: page
          }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
        }
      );
  },
  //Description: Returns count of items 
  //Request Type: GET
  GetCountItems: function (): Promise<void | number> {
    let ret: number;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/GetCountItems",
      {
          headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = parseInt(result);
          return ret;
        },
        (error) => {
          console.log(error);
        }
      );
  },
  
  //Description: Create a new account, returns the created user
  //Request Type: POST
  //Parameters:
  //email: string
  //password: string
  //name: string
  CreateAccount: function (
    email: string | undefined,
    password: string | undefined,
    name: string | undefined
  ): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/createuser",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          Password: password,
          Name: name,
          Cart: [],
          RecentlyViewed: [],
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: logs user in by email/password combo returns the user if it exists, otherwise returns an error message
  //Request Type: POST
  //Parameters:
  //email: string
  //password: string
  DoLogin: function (
    email: string | undefined,
    password: string | undefined
  ): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/DoLogin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: logs user in by stored cookie if valid, if expired returns error message
  //Request Type: POST
  //Parameters:
  //token: string
  DoLoginToken: function (token: string): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/DoLogin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Token: token }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: logs the user in by email, returns error if it does not exist
  //Request Type: POST
  //Parameters:
  //email: string
  DoLoginEmail: function (email: string): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/DoLogin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, byEmailOnly: true }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: add an item to the cart, returns error if it fails
  //Request Type: POST
  //Parameters:
  //email: string, email of the user
  //id: string, id of the item
  //count: number, current count of whats in the cart
  //numToPush: number, number of the item to push
  PushToCart: function (
    email: String,
    id: String,
    count: number,
    numToPush: number
  ): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/PushToCart",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          item: { id: id, count },
          numToPush: numToPush,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: remove an item from the cart, returns error if it fails
  //Request Type: POST
  //Parameters:
  //email: string, email of the user
  //id: string, id of the item
  //count: number, current count of whats in the cart
  //numToRemove: number, number of the item to remove
  RemoveFromCart: function (
    email: String,
    id: String,
    count: number,
    numToRemove: number
  ): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/RemoveFromCart",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          item: { id: id, count },
          numToRemove: numToRemove,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: get a specific item by item id
  //Request Type: POST
  //Parameters:
  //id: string, id of the item
  GetItem: function (id: String | undefined): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/GetItem",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id: id }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: Get multiple items by id
  //Request Type: POST
  //Parameters:
  //cart: userItem[], array of the objects to get
  GetItemsById: function (cart: userItem[]): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/GetItemsById",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Items: cart }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: Get the stripe secret allowing checkout
  //Request Type: POST
  //Parameters:
  //total: number, total cost
  //email: string, email of the user
  GetStripeSecret: function (total: number, email: String): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/CreatePaymentIntent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: total, email: email }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: get an upload url for the s3 bucket
  //Request Type: POST
  //Parameters:
  //file: string, representation of the file
  GetS3Url: function (file: string): Promise<S3Response> {
    let ret: Response;
    console.log(file);
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/UploadImageWebshop",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: use the upload url to upload a file to s3
  //Request Type: POST
  //Parameters:
  //url: string, upload url
  //file: File, file to be uploaded
  UploadToS3: function (url: string, file: File | null): Promise<S3Response> {
    let ret;
    console.log(url);
    console.log(file);
    return fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "multipart/form-data" },
      body: file,
    }).then(
      (result) => {
        console.log(result.url);
        ret = result;
        return ret;
      },
      (error) => {
        console.log(error);
        return error.message;
      }
    );
  },
  //Description: add a new item to the shop
  //Request Type: POST
  //Parameters:
  //name: string, name of item
  //price: number,
  //description: string
  //img_url: string
  AddItem: function (
    name: string,
    price: number,
    description: string,
    img_url: string
  ): Promise<Response> {
    let ret: Response;
    console.log(price);
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/AddItem",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,
          Price: price,
          Description: description,
          Img_url: img_url,
          Sold: 0,
          Reviews: [],
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  //Description: add a new review to an item
  //Request Type: POST
  //Parameters:
  //name: string, name of person leaving the review
  //review: string
  //rating: number, out of 5
  //id: string, id of item
  AddReview: function (
    name: string,
    review: string,
    rating: number,
    id: string
  ): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/AddReview",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          User_name: name,
          Review: review,
          Rating: rating,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          ret = result;
          return ret;
        },
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
};
