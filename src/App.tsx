import { useState, useEffect } from "react";
import Nav from "./Components/nav/Nav";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Display from "./Components/display/Display";
import { useCookies } from "react-cookie";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setUser } from "./Slices/UserSlice";
import { api } from "./Api/api";
import { Response } from "./Types/Response";
import {
  selectNotification,
  setNotification as sendNotification
} from "./Slices/NotificationSlice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Alert } from "@mui/material";
import { Item } from "./Components/item/Item";
import { Cart } from "./Components/cart/Cart";
import setNotification from "./Common/SendNotification";
import Status from "./Components/status/Status";
import CheckoutContainer from "./Components/checkout/CheckoutContainer";

function App() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectNotification);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  useEffect(() => {
    if (cookies.token) {
      api.DoLoginToken(cookies.token).then((val: Response) => {
        if (val.message === "Successful") {
          dispatch(setUser(val.user));
        } else if(val.message){
          //dispatch error with message
          setNotification(val.message, "error");
          removeCookie("token", { path: "/" });
        }
      });
    }
  }, []);

  const closeAlert = () => {
    console.log("closing");
    dispatch(sendNotification({ text: "", severity: "error", visible: false }));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/:id/checkoutstatus" element={<CheckoutContainer />} />
        </Routes>
        {notification.text.length > 0 && notification.visible && (
          <Alert
            severity={notification.severity}
            onClose={() => {
              closeAlert();
            }}
            sx={{
              position: "fixed",
              zIndex: "200",
              color: "error",
              bottom: "10%",
              left: "3%",
              width: "94vw",
            }}
          >
            {notification.text}
          </Alert>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
