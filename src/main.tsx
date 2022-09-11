import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import appTheme from "./Theme";
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
    <App />
    </ThemeProvider>
  </React.StrictMode>
)
