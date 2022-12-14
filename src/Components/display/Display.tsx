import React, { Key, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { api } from "../../Api/api";
import { Item } from "../../Types/Item";
import currencyFormat from "../../Common/CurrencyFormat";
import { addToCart, selectUser } from "../../Slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userItem } from "../../Types/UserItem";
import { selectNotification } from "../../Slices/NotificationSlice";
import setNotification from "../../Common/SendNotification";
import { Link } from "react-router-dom";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import CarouselDisplay from "../carousel/Carousel";

export default function Display() {
  const theme = useTheme();
  const user = useAppSelector(selectUser);
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  let page: Number = 0;

  useEffect(() => {
    setIsLoading(true);
    api.GetItems(page).then((e) => {
      if (e) {
        setItems(e);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    //console.log(items);
  }, [items]);

  const pushToCart = (item: Item) => {
    if (user.Name.length < 1) {
      setNotification("Please login to add to cart", "error");
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
    api.PushToCart(user.Email, item._id, obj.count, 1).then((val) => {
      if (val.message === "Successfully added to cart") {
        obj.count = obj.count + 1;
        dispatch(addToCart(obj));
        setNotification(val.message, "success");
      } else {
        setNotification(val.message, "error");
      }
      setInProgress(false);
    });
  };

  const renderDisplay = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 2,
            pb: 2,
          }}
        ></Box>
        {items.length > 0 && (
          <Container sx={{ pb: 2, pt: 2 }}>
            {/* End hero unit */}
            <Grid container spacing={4}>
              {items.map((i) => (
                <Grid item key={i._id as Key} xs={6} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link
                      to={{
                        pathname: "/item/" + i._id,
                      }}
                      state={{ lastPage: "/" }}
                    >
                      <CardMedia
                        component="img"
                        image={i.Img_url}
                        alt={i.Name.toString()}
                        sx={{
                          minHeight: "50%",
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, color: "text.primary" }}>
                        <Typography gutterBottom variant="h5" component="h2" sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}>
                          {i.Name}
                        </Typography>
                        <Typography
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {i.Description}
                        </Typography>
                      </CardContent>
                      <Typography sx={{ color: "text.primary" }}>
                        {currencyFormat(i.Price)}
                      </Typography>
                    </Link>
                    <CardActions
                      sx={{
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        size="small"
                        sx={{
                          color: "secondary.dark",
                        }}
                        onClick={() => {
                          pushToCart(i);
                        }}
                        disabled={inProgress}
                      >
                        Add To Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </main>
      <hr />
      <CarouselDisplay />
    </ThemeProvider>
  );
  return <div>{isLoading ? <LoadingSpinner /> : renderDisplay}</div>;
}
