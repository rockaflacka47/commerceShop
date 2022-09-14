import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store/store";
import { Notification } from "../Types/Notification";

const initialState: Notification = {
    text: "",
    severity: "error",
    visible: false
}


export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, notif: PayloadAction<Notification>) => {
      console.log(notif);
      state.text = notif.payload.text;
      state.severity = notif.payload.severity;
      state.visible = notif.payload.visible;
    },
  },
});

export const { setNotification } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification;

export default notificationSlice.reducer;
