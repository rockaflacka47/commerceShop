import { createTheme, ThemeProvider } from "@mui/material";
import { red, blueGrey } from "@mui/material/colors";

const appTheme = createTheme({
    palette: {
        primary: {
            main: blueGrey[700],
            light: "#718792",
            dark: "#1c313a",
            contrastText: "#ffffff"
        },
        secondary: {
            main: red.A100,
            light: "#ffbcaf",
            dark: "#c85a54",
            contrastText: "#000000"
        },
        error: {
            main: red.A400
        },
    },
});

export default appTheme;