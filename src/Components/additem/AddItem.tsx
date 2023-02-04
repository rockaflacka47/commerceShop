import {
  useTheme,
  Container,
  CssBaseline,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import setNotification from "../../Common/SendNotification";
import { api } from "../../Api/api";

export default function AddItem() {
  const [err, setErr] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>(0);
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //check if all fields are filled out
    if (
      name === "" ||
      isNaN(parseFloat(price.toString())) ||
      description === ""
    ) {
      setErr(true);
      setNotification("Please fill out all fields", "error");
      return;
    }
    if (price === 0) {
      setErr(true);
      setNotification("Please enter a price greater than 0", "error");
      return;
    }
    setErr(false);

    api
      .AddItem(name, parseFloat(price.toString()), description, imgUrl)
      .then((val) => {
        if (val.message == "Successfully added item!") {
          setName("");
          setPrice(0);
          setDescription("");
          setImgUrl("");
          setNotification(val.message, "success");
        } else {
          setNotification(val.message, "error");
        }
      });
  };

  const handleChange = async function (
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files[0] != null
    ) {
      api.GetS3Url(event.target.files[0].name).then((val) => {
        if (val.fileUploadURL) {
          api //@ts-ignore
            .UploadToS3(val.fileUploadURL, event.target.files[0])
            .then((res) => {
              if (res.status === 200) {
                setNotification("Image uploaded successfully", "success");
                setImgUrl(res.url.split("?")[0]);
              } else {
                setNotification(
                  "Error uploading the image, please try again or select a different image.",
                  "error"
                );
              }
            });
        } else {
          setNotification(
            "Error uploading the image, please try again or select a different image.",
            "error"
          );
        }
      });
    }
  };

  //@ts-ignore
  const setP = (e) => {
    setPrice(parseFloat(e.target.value));
  };

  const renderForm = (
    <Container
      component="main"
      sx={{
        marginLeft: { md: "-3%" },
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "90vw",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add New Item
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "90%" }}
        >
          <Grid container spacing={1} justifyContent="space-between">
            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                id="name"
                label="Name"
                name="name"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                error={err && name === ""}
                sx={{
                  width: "90%",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                name="price"
                label="Price"
                type="number"
                id="price"
                inputProps={{
                  step: 0.01,
                }}
                onChange={(e) => {
                  setP(e);
                }}
                error={
                  err && (price === 0 || isNaN(parseFloat(price.toString())))
                }
                sx={{
                  width: "90%",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                id="description"
                label="Description"
                name="description"
                value={description}
                multiline
                onChange={(e) => setDescription(e.target.value)}
                error={err && description === ""}
                rows="4"
                sx={{
                  width: "95%",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload File
                <input type="file" hidden onChange={handleChange} />
              </Button>
            </Grid>
            {imgUrl && (
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  name="url"
                  label="Image Url"
                  id="url"
                  value={imgUrl}
                  sx={{
                    width: "95%",
                  }}
                  disabled
                />
              </Grid>
            )}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            disabled={!imgUrl}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "secondary.dark",
              width: "95%",
            }}
          >
            Add Item
          </Button>
        </Box>
      </Box>
    </Container>
  );
  return renderForm;
}
