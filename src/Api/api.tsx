import React from "react";
import { Item } from "../Types/Item";
import { Response, S3Response } from "../Types/Response";
import { User } from "../Types/User";
import { userItem } from "../Types/UserItem";

export const api = {
  GetItems: function (page: Number): Promise<void | Item[]> {
    let ret: Item[];
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: page }),
    };
    return fetch(
      "https://3jpt2tyzj3.execute-api.eu-west-3.amazonaws.com/default/GetItems",
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      );
  },
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
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
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
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
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
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
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
        body: JSON.stringify({ Email: email, item: { id: id, count }, numToPush: numToPush }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
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
        body: JSON.stringify({ Email: email, item: { id: id, count }, numToRemove: numToRemove }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  GetItem: function (id: String | undefined): Promise<Response> {
    let ret: Response;
    return fetch("https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/GetItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Id: id }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },GetItemsById: function (cart: userItem[]): Promise<Response> {
    let ret: Response;
    return fetch("https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/GetItemsById", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Items: cart }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },GetStripeSecret: function (total: number): Promise<Response> {
    let ret: Response;
    return fetch("https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/CreatePaymentIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total: total }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  GetS3Url: function (file: string): Promise<S3Response> {
    let ret: Response;
    console.log(file);
    return fetch("https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/UploadImageWebshop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  UploadToS3: function (url: string, file: File | null): Promise<S3Response> {
    let ret;
    console.log(url)
    console.log(file);
    return fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "multipart/form-data" },
      body: file
    })
      .then(
        (result) => {
          console.log(result.url);
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  AddItem: function (name: string, price: number, description: string, img_url: string): Promise<Response> {
    let ret: Response;
    console.log(price);
    return fetch("https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/AddItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: name,
        Price: price,
        Description: description,
        Img_url: img_url,
        Sold: 0,
        Reviews: []
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
  AddReview: function (name: string, review: string, rating: number, id: string): Promise<Response> {
    let ret: Response;
    return fetch("https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/AddReview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        User_name: name,
        Review: review,
        Rating: rating
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          ret = result;
          return ret;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          return error.message;
        }
      );
  },
};
