import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { store } from "./Store/store";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import appTheme from "./Theme";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CookiesProvider>
        <Provider store={store}>
          <CssBaseline enableColorScheme />
          <App />
        </Provider>
      </CookiesProvider>
    </ThemeProvider>
  </React.StrictMode>
);
