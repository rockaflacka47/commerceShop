import {
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
import { selectUser, addToRecentlyViewed } from "../../Slices/UserSlice";
import { Item as displayItem } from "../../Types/Item";
import currencyFormat from "../../Common/CurrencyFormat";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import "./Item.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import setNotification from "../../Common/SendNotification";
import { RecentlyViewed } from "../../Types/RecentlyViewed";
import Rating from "../../Common/Rating";
import { pushToCart, removeFromCart } from "../../Common/CartManagement";

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
  const location = useLocation();
  const { lastPage } = location.state;
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [item, setItem] = useState<displayItem>(defualtItem);
  const [quantity, setQuantity] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [quantToAdd, setQuantToAdd] = useState<string>("1");
  const [rating, setRating] = useState<number | string>(0);
  const [review, setReview] = useState<string>("");
  const { id } = useParams();

  const theme = useTheme();
  useEffect(() => {
    setIsLoading(true);
    api.GetItem(id).then((val) => {
      if (val.item) {
        setItem(val.item);
        setIsLoading(false);
        let viewedObj: RecentlyViewed = {
          id: val.item._id,
          img_url: val.item.Img_url,
          name: val.item.Name,
        };
        dispatch(addToRecentlyViewed(viewedObj));
      } else {
        setIsLoading(false);
        setNotification("Error loading item, please try again", "error");
      }
    });
  }, []);

  const calculateRating = () => {
    let total = 0;
    item.Reviews.map((review) => {
      total += review.Rating;
    });
    if (total > 0 && item.Reviews.length > 0) {
      setOverallRating(Math.round((total / item.Reviews.length) * 10) / 10);
    } else if (total == 0 && item.Reviews.length > 0) {
      setOverallRating(0);
    } else {
      setOverallRating(-1);
    }
  };
  useEffect(() => {
    if (user.Name.length > 0) {
      setQuantity(searchCart());
    }
    calculateRating();
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

  const pushToCartContainer = async () => {
    setInProgress(true);
    let index: number = user.Cart.findIndex((e) => {
      return e.id === item._id;
    });
    let count: number = -1;
    if (index >= 0) {
      count = user.Cart[index].count;
    }
    if (count === -1) {
      count = 0;
    }
    let status = await pushToCart(user, item, quantToAdd, count, dispatch);
    if (status === "success") {
      setQuantity(quantity + parseInt(quantToAdd));
    }
    setInProgress(false);
  };

  const removeCartContainer = async () => {
    let index: number = user.Cart.findIndex((e) => {
      return e.id === item._id;
    });
    let count;

    count = user.Cart[index].count;

    setInProgress(true);
    let status = await removeFromCart(user, item, quantToAdd, count, dispatch);
    if (status === "success") {
      setQuantity(quantity - parseInt(quantToAdd));
    }
    setInProgress(false);
  };

  const setQuantVal = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target) {
      setQuantToAdd(event.target.value);
    }
  };

  const submitReview = () => {
    if (!user.Name.length) {
      setNotification("Please login to leave a review", "error");
      return;
    }
    if (isNaN(parseFloat(rating.toString())) || review === "") {
      setNotification("Please fill out the review and give a rating", "error");
      return;
    }

    api
      .AddReview(user.Name, review, parseFloat(rating.toString()), item._id)
      .then((val) => {
        if (val.message === "Successfully added review") {
          let reviews = item.Reviews;

          reviews.push({
            User_name: user.Name,
            Review: review,
            Rating: parseFloat(rating.toString()),
          });

          let tempitem = item;
          tempitem.Reviews = reviews;

          setItem(tempitem);
          calculateRating();
          setReview("");
          setRating(0);
          setNotification(val.message, "success");
        } else {
          setNotification(val.message, "error");
        }
      });
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
          mt: { xs: "2vh" },
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={6} className="margin-auto">
            <CardMedia
              component="img"
              image={item.Img_url}
              alt={item.Name.toString()}
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

              {overallRating && overallRating > -1 && (
                <Container>
                  <Rating rating={overallRating} />
                </Container>
              )}
              {overallRating && overallRating == -1 && (
                <Typography component="h2" className="rating">
                  No ratings yet
                </Typography>
              )}
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
                <Grid xs={12} md={4}>
                  <Button
                    variant="outlined"
                    onClick={removeCartContainer}
                    color="warning"
                    className="min-width-100"
                    disabled={inProgress || !(quantity > 0)}
                    sx={{
                      minHeight: { xs: "10vh", md: "12vh", lg: "10vh" },
                    }}
                  >
                    Remove from cart
                  </Button>
                </Grid>
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
                    onClick={pushToCartContainer}
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
              value={review}
              onChange={(e) => setReview(e.target.value)}
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
                inputProps={{
                  step: 0.1,
                }}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                sx={{
                  width: { xs: "100%", md: "56%" },
                }}
              />
            </Grid>
            <Grid xs={5}>
              <Button
                color="warning"
                variant="outlined"
                onClick={submitReview}
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
                  <Card
                    key={review.Review}
                    variant="outlined"
                    sx={{
                      borderColor: "primary.main",
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid xs={6}>
                          <Typography>Left By: {review.User_name} </Typography>
                        </Grid>
                        <Grid xs={6}>
                          <Typography
                            sx={{
                              display: "inline-flex",
                            }}
                          >
                            {" "}
                            Rating:{" "}
                            {review.Rating && <Rating rating={review.Rating} />}
                          </Typography>
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
