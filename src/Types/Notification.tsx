import { AlertColor } from "@mui/material";
import React from "react";

export interface Notification {
    text: string,
    severity: AlertColor,
    visible: boolean,
}