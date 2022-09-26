import {
  autocompleteClasses,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { api } from "../../Api/api";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectUser, addToCart, removeFromCart } from "../../Slices/UserSlice";
import { Item as displayItem } from "../../Types/Item";
import currencyFormat from "../../Common/CurrencyFormat";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import "./Item.css";
import { Review } from "../../Types/Review";
import StarsIcon from "@mui/icons-material/Stars";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowBack } from "@mui/icons-material";
import { userItem } from "../../Types/UserItem";

import setNotification from "../../Common/SendNotification";

const defualtItem: displayItem = {
  _id: "",
  Name: "",
  Price: 0,
  Description: "",
  Img_url: "",
  Sold: 0,
  Alternate_pictures: [],
  Reviews: [],
};
export function Item() {
    const location = useLocation()
  const { lastPage } = location.state
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [item, setItem] = useState<displayItem>(defualtItem);
  const [quantity, setQuantity] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [quantToAdd, setQuantToAdd] = useState<string>("1");
  const { id } = useParams();

  const theme = useTheme();
  useEffect(() => {
    setIsLoading(true);
    api.GetItem(id).then((val) => {
      if (val.item) {
        setItem(val.item);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setNotification("Error loading item, please try again", "error");
      }
    });
  }, []);

  useEffect(() => {
    if (user.Name.length > 0) {
      setQuantity(searchCart());
    }
    let total = 0;
    item.Reviews.map((review) => {
      total += review.Rating;
    });
    setOverallRating(Math.round((total / item.Reviews.length) * 10) / 10);
  }, [item]);

  useEffect(() => {
    if (user.Name.length > 0) {
      setQuantity(searchCart());
    }
  }, [user]);

  const searchCart = () => {
    let i = user.Cart.find((val) => val.id === item._id);
    return i ? i.count : 0;
  };

  const pushToCart = () => {
    if (user.Name.length < 1) {
        setNotification("Please login to add to cart", "error");
      return;
    }
    if (!quantToAdd) {
        setNotification("Please enter a quantity", "error");
      return;
    }
    if (parseInt(quantToAdd) < 1) {
        setNotification("Please enter a quantity greater than 0", "error");
      return;
    }
    let index: number = user.Cart.findIndex((e) => {
      return e.id === item._id;
    });
    let count;
    if (index >= 0) {
      count = user.Cart[index];
    }
    let obj: userItem;
    if (count) {
      obj = {
        id: count.id,
        count: count.count,
      };
    } else {
      obj = {
        id: item._id,
        count: 0,
      };
    }
    setInProgress(true);
    api
      .PushToCart(user.Email, item._id, obj.count, parseInt(quantToAdd))
      .then((val) => {
        if (val.message === "Successfully added to cart") {
          obj.count = obj.count + parseInt(quantToAdd);
          dispatch(addToCart(obj));
          setQuantity(quantity + parseInt(quantToAdd));
          setInProgress(false);
          setNotification(val.message, "success");
        } else {
          setInProgress(false);
          setNotification(val.message, "error");
        }
      });
  };

  const removeCart = () => {
    let index: number = user.Cart.findIndex((e) => {
      return e.id === item._id;
    });
    let count;
    if (index < 0) {
        setNotification("This item is not in your cart.", "error");
      return;
    }
    if (!quantToAdd) {
        setNotification("Please enter a quantity", "error");
      return;
    }
    count = user.Cart[index];
    if (count.count < parseInt(quantToAdd)) {
        setNotification("Cannot remove more then what is currently in the cart.", "error");
      return;
    }
    let obj: userItem = {
      id: count.id,
      count: count.count,
    };
    setInProgress(true);
    api
      .RemoveFromCart(user.Email, item._id, obj.count, parseInt(quantToAdd))
      .then((val) => {
        if (val.message === "Successfully removed from cart") {
          obj.count = obj.count - parseInt(quantToAdd);
          dispatch(removeFromCart(obj));
          setQuantity(quantity - parseInt(quantToAdd));
          setInProgress(false);
          setNotification(val.message, "success");
        } else {
          setInProgress(false);
          setNotification(val.message, "error");
        }
      });
  };

  const setQuantVal = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target) {
      setQuantToAdd(event.target.value);
    }
  };

  const renderItem = (
    <Container>
      <Container
        sx={{
          marginTop: { xs: "5vh" },
        }}
        className="link-container"
      >
        <Link to={lastPage} color="warning" className="back">
          <ArrowBackIcon fontSize="small" className="star" />
          Back
        </Link>
      </Container>
      <Paper
        elevation={8}
        sx={{
          //   height: "75vh"
          mt: { xs: "2vh" },
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={6} className="margin-auto">
            <CardMedia
              component="img"
              image={item.Img_url}
              alt={item.Name.toString()}
              // sx={{
              //     objectFit: "contain",
              //     height: "20vh",
              //     width: "45vw"
              // }}
            />
            {item.Alternate_pictures && item.Alternate_pictures.length > 0 && (
              <div></div>
            )}
          </Grid>
          <Grid xs={12} md={6} margin="auto">
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {item.Name}
              </Typography>
              <Typography component="h2" className="rating">
                {overallRating ? overallRating + "/5" : "No ratings yet"}
                <StarsIcon
                  fontSize="small"
                  className="star"
                  sx={{
                    ...(overallRating && {
                      display: "block",
                    }),
                    ...(!overallRating && {
                      display: "none",
                    }),
                  }}
                />
              </Typography>
            </CardContent>
            <CardContent>
              {
                //className="description-box"}>
              }
              <Typography>{item.Description}</Typography>
            </CardContent>
            <Grid xs={12} justifyContent="">
              <Typography>In Cart: {quantity}</Typography>
              <Typography>Cost: {currencyFormat(item.Price)}</Typography>
              <Typography>
                Total Cost: {currencyFormat(quantity * item.Price)}
              </Typography>
              <Grid container className="button-box">
                {quantity > 0 && (
                  <Grid xs={12} md={4}>
                    <Button
                      variant="outlined"
                      onClick={removeCart}
                      color="warning"
                      className="min-width-100"
                      disabled={inProgress}
                      sx={{
                        minHeight: { xs: "10vh", md: "12vh", lg: "10vh" },
                      }}
                    >
                      Remove from cart
                    </Button>
                  </Grid>
                )}
                <Grid
                  xs={12}
                  md={3}
                  sx={{
                    margin: "auto",
                  }}
                >
                  <TextField
                    name="quantity"
                    placeholder="Quantity"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    id="quantity"
                    value={quantToAdd}
                    onChange={(event) => setQuantVal(event)}
                    sx={{
                      margin: "auto",
                      minHeight: { xs: "10vh", md: "12vh", lg: "10vh" },
                    }}
                    className="min-width-100"
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <Button
                    variant="outlined"
                    onClick={pushToCart}
                    disabled={inProgress}
                    color="warning"
                    className="min-width-100"
                    sx={{
                      minHeight: { xs: "10vh", md: "12vh", lg: "10vh" },
                    }}
                  >
                    Add to cart
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid xs={11} margin="auto">
            <hr/>
        </Grid> */}
        </Grid>
      </Paper>
      <Paper
        sx={{
          marginTop: "2%",
        }}
        elevation={8}
      >
        <Grid container spacing={2}>
          <Grid
            xs={12}
            justifyContent="center"
            sx={{
              minHeight: "15vh",
            }}
          >
            <TextField
              placeholder="Leave a review..."
              multiline
              className="review-box"
              minRows={4}
            />
          </Grid>
          <Grid container xs={12} justifyContent="center">
            <Grid xs={5}>
              <TextField
                name="rating"
                placeholder="Rating"
                type="number"
                id="rating"
                sx={{
                  width: { xs: "100%", md: "56%" },
                }}
              />
            </Grid>
            <Grid xs={5}>
              <Button
                color="warning"
                variant="outlined"
                sx={{
                  width: { xs: "100%", md: "56%" },
                  height: "100%",
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>

          <Grid xs={12} justifyContent="center">
            <Stack
              spacing={0}
              justifyContent="center"
              overflow="scroll"
              maxWidth="65%"
              margin="auto"
              mb="5%"
            >
              {item.Reviews &&
                item.Reviews.length > 0 &&
                item.Reviews.map((review) => (
                  <Card key={review.Review} variant="outlined" sx={{
                      borderColor: "primary.main"
                  }}>
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid xs={6}>
                          <Typography>Left By: {review.User_name} </Typography>
                        </Grid>
                        <Grid xs={6}>
                          <Typography> Rating: {review.Rating}</Typography>
                        </Grid>
                      </Grid>
                      <Grid xs={12}>
                        <Typography>{review.Review}</Typography>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
  return <div>{isLoading ? <LoadingSpinner /> : renderItem}</div>;
}
