import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../Api/api";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectUser } from "../../Slices/UserSlice";
import { Item as displayItem } from "../../Types/Item";
import currencyFormat from "../../Common/CurrencyFormat";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import "./Item.css";
import { Review } from "../../Types/Review";
import StarsIcon from "@mui/icons-material/Stars";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { setNotification } from "../../Slices/NotificationSlice";
import { ArrowBack } from "@mui/icons-material";

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
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [item, setItem] = useState<displayItem>(defualtItem);
  const [quantity, setQuantity] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
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
        //dispatch error
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

  const addToCart = () => {
      if(user.Name.length < 1){
          dispatch(setNotification({text: "Please login to add to cart", severity: "error", visible: true}))
          setTimeout(() => dispatch(setNotification({text: "", severity: "error", visible: false})), 5000);
          return;
      }
    console.log("adding to cart");
  };

  const removeFromCart = () => {
    console.log("remove to cart");
  };

  const renderItem = (
    <Container>
        <Container sx={{
            marginTop: { xs: "5vh" }
        }} className="link-container">
            <Link to="/" color="warning" className="back"><ArrowBackIcon fontSize="small" className="star"/>Back To Home</Link>
        </Container>
      <Paper elevation={8}
        sx={{
          //   height: "75vh"
          mt: { xs: "2vh"},
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
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
              <Typography component="h2" className="rating">
                {overallRating}/5
                <StarsIcon fontSize="small" className="star" />
              </Typography>
            </CardContent>
            <CardContent>
              <Typography>{item.Description}</Typography>
            </CardContent>
          </Grid>
          <Grid xs={12} justifyContent="">
            <Typography>In Cart: {quantity}</Typography>
            <Typography>Cost: {currencyFormat(item.Price)}</Typography>
            <Grid container className="button-box">
              {quantity > 0 && (
                <Grid xs={12} md={6}>
                  <Button
                    variant="outlined"
                    onClick={removeFromCart}
                    color="warning"
                    className="min-width-80"
                    sx={{
                      minHeight: { xs: "10vh", md: "unset" },
                    }}
                  >
                    Remove from cart
                  </Button>
                </Grid>
              )}
              <Grid xs={12} md={6}>
                <Button
                  variant="outlined"
                  onClick={addToCart}
                  color="warning"
                  className="min-width-80"
                  sx={{
                    minHeight: { xs: "10vh", md: "unset" },
                  }}
                >
                  Add to cart
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{
          marginTop: '2%'
      }} elevation={8}>
        <Grid container spacing={2} mt="1%">
          <Grid xs={12} justifyContent="center">
            <Stack
              spacing={0}
              justifyContent="center"
              overflow="scroll"
              maxWidth="65%"
              margin="auto"
              mb="5%"
            >
              <textarea placeholder="Leave a review..." />
              {item.Reviews &&
                item.Reviews.length > 0 &&
                item.Reviews.map((review) => (
                  <Card key={review.Review} variant="outlined">
                    <CardContent>
                      <Typography>Left By: {review.User_name}</Typography>
                      <Typography>Rating: {review.Rating}</Typography>
                      <Typography>{review.Review}</Typography>
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
