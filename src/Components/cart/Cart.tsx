import {
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  CardMedia,
  Button,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import React, { ChangeEvent, Key, useEffect, useState } from "react";
import { api } from "../../Api/api";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addToCart, removeFromCart, selectUser } from "../../Slices/UserSlice";
import { Item } from "../../Types/Item";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import Grid from "@mui/material/Unstable_Grid2";
import StarsIcon from "@mui/icons-material/Stars";
import setNotification from "../../Common/SendNotification";
import currencyFormat from "../../Common/CurrencyFormat";
import { Link } from "react-router-dom";
import { Review } from "../../Types/Review";
import { userItem } from "../../Types/UserItem";
import CartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckoutContainer from "../checkout/CheckoutContainer";
import "./Cart.css";
import CarouselDisplay from "../carousel/Carousel";

export function Cart() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [counts, setCounts] = useState<Map<string, number>>(new Map());
  const [ratings, setRatings] = useState<number[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [quantToAdd, setQuantToAdd] = useState<Map<string, string>>(new Map());
  const [testval, setTestVal] = useState<string>("1");
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [secret, setSecret] = useState<string>("");
  let countMap = new Map();
  let ratingsMap: number[] = [];
  let quantMap = new Map();
  let cost = 0;
  let update = false;

  const setUpCount = () => {
    user.Cart.forEach((i: userItem) => {
      countMap.set(i.id, i.count);
      quantMap.set(i.id, "1");
    });
  };

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    if (user.Name.length > 0 && !update) {
      initializePage();
    }
  }, [user]);

  const initializePage = () => {
    setIsLoading(true);
    setUpCount();
    setCounts(countMap);
    setQuantToAdd(quantMap);

    api.GetItemsById(user.Cart).then((val) => {
      if (val.message === "Success") {
        setItems(val.response);
      } else {
        setNotification(val.message, "error");
      }
    });
  };

  useEffect(() => {
    items?.forEach((i: Item, index) => {
      let total = 0;
      i.Reviews.forEach((review) => {
        total += review.Rating;
      });
      total = Math.round((total / i.Reviews.length) * 10) / 10;
      ratingsMap.push(total);
      let c = counts.get(i._id) ? counts.get(i._id) : 0;
      if (c) {
        cost += c * i.Price;
      }
    });
    setRatings(ratingsMap);
    setTotalCost(cost);
    setIsLoading(false);
  }, [items]);

  const setQuantVal = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    i: Item
  ) => {
    if (event.target) {
      quantMap = quantToAdd;
      quantMap.set(i._id, event.target.value);
      setQuantToAdd(quantMap);
      setTestVal(event.target.value);
    }
  };

  useEffect(() => {}, [quantToAdd]);

  const pushToCart = (item: Item, mapIndex: number) => {
    if (user.Name.length < 1) {
      setNotification("Please login to add to cart", "error");
      return;
    }
    let q = quantToAdd.get(item._id);

    if (q) {
      let quant = parseInt(q);
      if (!quant) {
        setNotification("Please enter a quantity", "error");
        return;
      }
      if (quant < 1) {
        setNotification("Please enter a quantity greater than 0", "error");
        return;
      }
      update = true;
      let count = counts.get(item._id);
      let obj: userItem;

      if (count) {
        obj = {
          id: item._id,
          count: count,
        };
        setInProgress(true);
        api.PushToCart(user.Email, item._id, obj.count, quant).then((val) => {
          if (val.message === "Successfully added to cart") {
            obj.count = obj.count + quant;
            dispatch(addToCart(obj));
            let countMap = counts;
            countMap.set(item._id, obj.count);
            setCounts(countMap);
            setInProgress(false);
            setNotification(val.message, "success");
          } else {
            setInProgress(false);
            setNotification(val.message, "error");
          }
        });
      }
    }
  };

  const removeCart = (item: Item, mapIndex: number) => {
    let index: number = user.Cart.findIndex((e) => {
      return e.id === item._id;
    });
    let count;
    if (index < 0) {
      setNotification("This item is not in your cart.", "error");
      return;
    }

    let q = quantToAdd.get(item._id);

    if (q) {
      let quant = parseInt(q);
      if (!quant) {
        setNotification("Please enter a quantity", "error");
        return;
      }
      count = counts.get(item._id);
      if (count) {
        if (count < quant) {
          setNotification(
            "Cannot remove more then what is currently in the cart.",
            "error"
          );
          return;
        }
        let obj: userItem = {
          id: item._id,
          count: count,
        };
        setInProgress(true);
        api
          .RemoveFromCart(user.Email, item._id, obj.count, quant)
          .then((val) => {
            if (val.message === "Successfully removed from cart") {
              obj.count = obj.count - quant;
              dispatch(removeFromCart(obj));
              let countMap = counts;
              countMap.set(item._id, obj.count);
              setCounts(countMap);
              setInProgress(false);
              setNotification(val.message, "success");
            } else {
              setInProgress(false);
              setNotification(val.message, "error");
            }
          });
      }
    }
  };

  const doCheckout = () => {
    api.GetStripeSecret(totalCost).then((val) => {
      setSecret(val.client_secret);
    });
  };

  useEffect(() => {
    if (secret.length > 0) {
      setShowCheckout(true);
    }
  }, [secret]);

  const renderCart = (
    <Container
      sx={{
        marginTop: "4vh",
      }}
    >
      {showCheckout && (
        <Container>
          <div
            className="background-exit"
            onClick={() => setShowCheckout(false)}
          ></div>
          <CheckoutContainer secret={secret} />
        </Container>
      )}
      {items && items.length > 0 && (
        <Container
          sx={{
            display: "inline-flex",
            minWidth: "100%",
            position: "sticky",
            top: { xs: "7.5vh", md: "7.5vh" },
            left: "0",
            height: { xs: "10vh", md: "7vh" },
            borderBottom: "solid 1px black",
            background: "#ffffff",
            zIndex: 100,
          }}
        >
          <CartIcon
            fontSize="large"
            sx={{
              my: "auto",
              color: "secondary.dark",
            }}
          />

          <Typography
            variant="h4"
            color="secondary.dark"
            marginLeft="1%"
            sx={{
              my: "auto",
            }}
          >
            Cart
          </Typography>
          <Typography
            variant="h6"
            color="secondary.dark"
            sx={{
              margin: "auto",
            }}
          >
            Total Cost: {currencyFormat(totalCost)}
          </Typography>
          <Button
            variant="contained"
            color="warning"
            onClick={() => doCheckout()}
            sx={{
              width: "30%",
              marginLeft: "auto",
              my: "auto",
              height: "80%",
            }}
          >
            Go To Checkout
          </Button>
        </Container>
      )}
      <Stack
        spacing={4}
        sx={{
          marginTop: { xs: "2vh" },
          mb: "5vh",
        }}
      >
        {items?.map((item, index) => (
          <Container key={item._id as Key}>
            <Paper
              elevation={8}
              sx={{
                //   height: "75vh"
                mt: { xs: "2vh", md: "0" },
                maxHeight: { xs: "unset", md: "25vh" },
                maxWidth: "75vw",
                mx: "auto"
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  //   height: "75vh"
                  maxHeight: { xs: "unset", md: "25vh" },
                  maxWidth: "75vw",
                  display: "flex",
                  alignContent: "center",
                }}
              >
                <Grid
                  xs={12}
                  md={4}
                  className="margin-auto"
                  sx={{
                    //   height: "75vh"
                    maxHeight: "25vh",
                    maxWidth: "75vw",
                  }}
                >
                  <Link to={"/item/" + item._id} state={{ lastPage: "/cart" }}>
                    <CardMedia
                      component="img"
                      image={item.Img_url}
                      alt={item.Name.toString()}
                      sx={{
                        objectFit: "contain",
                        height: "20vh",
                      }}
                    />
                  </Link>
                  {item.Alternate_pictures &&
                    item.Alternate_pictures.length > 0 && <div></div>}
                </Grid>
                <Grid
                  xs={12}
                  md={4}
                  margin="auto"
                  sx={{
                    //   height: "75vh"
                    maxHeight: { xs: "unset", md: "25vh" },
                    maxWidth: "75vw",
                    alignContent: "center",
                  }}
                >
                  <Link to={"/item/" + item._id} state={{ lastPage: "/cart" }}>
                    <CardContent
                      sx={{
                        color: "black",
                      }}
                    >
                      <Typography gutterBottom variant="h5" component="h2">
                        {item.Name}
                      </Typography>
                      <Typography component="h2" className="rating">
                        {
                          //@ts-ignore
                          ratings[index] && ratings[index] != "NaN"
                            ? ratings[index] + "/5"
                            : "No ratings yet"
                        }
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
                    <CardContent
                      sx={{
                        color: "black",
                      }}
                    >
                      {
                        //className="description-box"}>
                      }
                      <Typography
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.Description}
                      </Typography>
                    </CardContent>
                  </Link>
                </Grid>
                <Grid xs={12} md={4} margin="auto">
                  <Typography>In Cart: {counts.get(item._id)}</Typography>
                  <Typography>Cost: {currencyFormat(item.Price)}</Typography>

                  <Typography>
                    Total Cost:{" "}
                    {
                      //@ts-ignore
                      currencyFormat(counts.get(item._id) * item.Price)
                    }
                  </Typography>

                  <Container
                    sx={{
                      display: "flex",
                      paddingLeft: "0px!important",
                      paddingRight: "0px!important",
                      borderRadius: "100px",
                    }}
                  >
                    <IconButton
                      color="warning"
                      aria-label="Remove from cart"
                      onClick={(event) => removeCart(item, index)}
                      disabled={inProgress}
                      sx={{
                        margin: "auto",
                        marginRight: "0",
                      }}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>

                    <TextField
                      name="quantity"
                      placeholder="Quantity"
                      type="number"
                      InputProps={{
                        inputProps: {
                          min: 0,
                          width: "70%",
                          height: "50%",
                          margin: "auto",
                        },
                      }}
                      id="quantity"
                      value={quantToAdd.get(item._id)}
                      onChange={(event) => setQuantVal(event, item)}
                      sx={{
                        margin: "auto",
                        width: "40%",
                        height: "50%",
                      }}
                    />
                    <IconButton
                      color="warning"
                      aria-label="Add from cart"
                      onClick={(event) => pushToCart(item, index)}
                      disabled={inProgress}
                      sx={{
                        margin: "auto",
                        marginLeft: "0",
                      }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Container>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        ))}
      </Stack>
      {items && (
        <>
          <hr />
          <CarouselDisplay />
        </>
      )}
    </Container>
  );
  return <div>{isLoading ? <LoadingSpinner /> : renderCart}</div>;
}
