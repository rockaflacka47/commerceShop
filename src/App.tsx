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
  setNotification,
} from "./Slices/NotificationSlice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Alert } from "@mui/material";
import { Item } from "./Components/item/Item";
import { Cart } from "./Components/cart/Cart";

function App() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectNotification);
  const [cookies, setCookie] = useCookies(["token"]);
  useEffect(() => {
    if (cookies.token) {
      api.DoLoginToken(cookies.token).then((val: Response) => {
        if (val.message === "Successful") {
          dispatch(setUser(val.user));
        } else {
          //dispatch error with message
        }
      });
    }
  }, []);

  const closeAlert = () => {
    console.log("closing");
    dispatch(setNotification({ text: "", severity: "error", visible: false }));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        {notification.text.length > 0 && notification.visible && (
          <Alert
            severity={notification.severity}
            onClose={() => {
              closeAlert();
            }}
            sx={{
              position: "fixed",
              zIndex: "100",
              color: "error",
              bottom: "10%",
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
