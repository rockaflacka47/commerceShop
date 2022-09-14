import React from "react";
import { Item } from "../Types/Item";
import { Response } from "../Types/Response";
import { User } from "../Types/User";

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
    count: number
  ): Promise<Response> {
    let ret: Response;
    return fetch(
      "https://na8zsbizz1.execute-api.eu-west-3.amazonaws.com/test/PushToCart",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, item: { id: id, count } }),
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
  },
};
