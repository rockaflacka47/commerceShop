import React from "react";
import { AppDispatch, store } from "../Store/store";
import { useAppDispatch } from "../hooks";
import { setNotification as sendNotification } from "../Slices/NotificationSlice";
import { AlertColor } from "@mui/material";
import { Item } from "../Types/Item";
import { User } from "../Types/User";
import setNotification from "./SendNotification";
import { userItem } from "../Types/UserItem";
import { api } from "../Api/api";
import { addToCart, removeFromCart as rfc } from "../Slices/UserSlice";

export async function pushToCart(user: User, item: Item, quantToAdd: string, count: number, dispatch: AppDispatch): Promise<string | undefined>{
    if (user.Name.length < 1) {
        setNotification("Please login to add to cart", "error");
        return "";
      }
      let q = quantToAdd;
  
      if (q) {
        let quant = parseInt(q);
        if (!quant) {
          setNotification("Please enter a quantity", "error");
          return "";
        }
        if (quant < 1) {
          setNotification("Please enter a quantity greater than 0", "error");
          return "";
        }
  
        let obj: userItem;
  
        if (count) {
          obj = {
            id: item._id,
            count: count,
          };

          api.PushToCart(user.Email, item._id, obj.count, quant).then((val) => {
            if (val.message === "Successfully added to cart") {
              //since the update was successful we can now update the front end
              obj.count = obj.count + quant;
              dispatch(addToCart(obj));
              setNotification(val.message, "success");
              return "success";
            } else {
              setNotification(val.message, "error");
              return "failed";
            }
          });
        }
      }
}

export async function removeFromCart(user: User, item: Item, quantToAdd: string, count: number, dispatch: AppDispatch): Promise<string | undefined> {
    let index: number = user.Cart.findIndex((e) => {
        return e.id === item._id;
      });
      if (index < 0) {
        setNotification("This item is not in your cart.", "error");
        return;
      }
      let q = quantToAdd;
      if (q) {
        let quant = parseInt(q);
        if (!quant) {
          setNotification("Please enter a quantity", "error");
          return;
        }
  
        if (count) {
          if (count < quant) {
            setNotification(
              "Cannot remove more then what is currently in the cart.",
              "error"
            );
            return;
          }
          let obj: userItem = {
            id: item._id,
            count: count,
          };
         
          api
            .RemoveFromCart(user.Email, item._id, obj.count, quant)
            .then((val) => {
              if (val.message === "Successfully removed from cart") {
                //since the update was successful we can now update the front end
                obj.count = obj.count - quant;
                dispatch(rfc(obj));
                setNotification(val.message, "success");
              } else {
                setNotification(val.message, "error");
              }
            });
        }
      }
}
