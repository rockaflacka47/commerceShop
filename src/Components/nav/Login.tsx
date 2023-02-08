import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import AccountCircle from "@mui/icons-material/AccountCircle";
import { api } from "../../Api/api";
import { Response } from "../../Types/Response";
//import { useDispatch } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { setUser } from "../../Slices/UserSlice";
import { useCookies } from "react-cookie";
import { Checkbox, FormControlLabel } from "@mui/material";
import setNotification from "../../Common/SendNotification";

export default function Login() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [fields, setFields] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]);
  const [isChecked, setIsChecked] = useState(true);
  let remember = true;

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    remember = isChecked;
  }, [isChecked]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("email") === "" ||
      data.get("password") === "" ||
      (fields && data.get("name") === "")
    ) {
      setNotification("Please fill out all fields", "error");
      return;
    }
    if (!fields) {
      api
        .DoLogin(
          data.get("email")?.toString(),
          data.get("password")?.toString()
        )
        .then((val: Response) => {
          if (val.message === "Successful") {
            if (remember) {
              setCookie("token", val.token, { path: "/" });
            }
            dispatch(setUser(val.user));
          } else if (val.message) {
            setNotification(val.message, "error");
          } else {
            setNotification("Error, please try again", "error");
          }
        });
    } else {
      api
        .CreateAccount(
          data.get("email")?.toString(),
          data.get("password")?.toString(),
          data.get("name")?.toString()
        )
        .then((val: Response) => {
          if (val.message === "Successful") {
            if (remember) {
              setCookie("token", val.token, { path: "/" });
            }
            dispatch(setUser(val.user));
          } else if (val.message === "A user with that email already exists") {
            setNotification(val.message, "error");
          } else {
            setNotification("Error, please try again", "error");
          }
        });
    }
  };

  const toggleFields = () => {
    setFields(!fields);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {!fields && (
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                color: "black",
              }}
            >
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Container>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      checked={isChecked}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  sx={{
                    color: "black",
                  }}
                  label="Remember me"
                />
              </Container>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "secondary.dark" }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => {
                      toggleFields();
                    }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        {fields && (
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <AccountCircle />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                color: "black",
              }}
            >
              Create Account
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    checked
                    onChange={handleChange}
                    color="primary"
                  />
                }
                sx={{
                  color: "black",
                }}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "secondary.dark" }}
              >
                Create Account
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => {
                      toggleFields();
                    }}
                  >
                    {"Already have an account? Login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
