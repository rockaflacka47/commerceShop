import React from "react";
import { store } from "../Store/store";
import { useAppDispatch } from "../hooks";
import { setNotification as sendNotification } from "../Slices/NotificationSlice";
import { AlertColor } from "@mui/material";

export default function setNotification(message: string, severity: AlertColor) {
  store.dispatch(
    sendNotification({
      text: message,
      severity: severity,
      visible: true,
    })
  );
  setTimeout(
    () =>
      store.dispatch(
        sendNotification({ text: "", severity: "error", visible: false })
      ),
    5000
  );
}
