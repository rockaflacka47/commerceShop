import { createTheme, ThemeProvider } from "@mui/material";
import { red, blueGrey, grey } from "@mui/material/colors";

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
        text: {
            primary: grey[900],
            secondary: "#c85a54",
        },
        warning: {
            main: "#c85a54"
        }
    },
});

export default appTheme;