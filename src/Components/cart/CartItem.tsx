import {
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import currencyFormat from "../../Common/CurrencyFormat";
import Rating from "../../Common/Rating";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectUser } from "../../Slices/UserSlice";
import { CartProps } from "../../Types/CartProps";
import { Item } from "../../Types/Item";
import { Review } from "../../Types/Review";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import { pushToCart, removeFromCart } from "../../Common/CartManagement";

export default function CartItem(props: CartProps) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  let item = props.item;
  const [count, setCount] = useState<number>(props.count);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [quantToAdd, setQuantToAdd] = useState<string>("1");
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  //calculate the average review
  useEffect(() => {
    setIsLoading(true);
    let total = 0;
    item.Reviews.forEach((review: Review) => {
      total += review.Rating;
    });
    if (total > 0) {
      total = Math.round((total / item.Reviews.length) * 10) / 10;
    } else if (total === 0 && item.Reviews.length > 0) {
      total = 1;
    } else {
      total = -1;
    }
    setOverallRating(total);
    setTotalCost(count * item.Price);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [overallRating]);

  const setQuantVal = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    i: Item
  ) => {
    if (event.target) {
      setQuantToAdd(event.target.value);
    }
  };

  const pushToCartContainer = async (item: Item) => {
    setInProgress(true);
    let status = await pushToCart(user, item, quantToAdd, count, dispatch);
    if (status === "success") {
      setCount(count + parseInt(quantToAdd));
      setInProgress(false);
    }
  };

  const removeCartContainer = async (item: Item) => {
    setInProgress(true);
    let status = await removeFromCart(user, item, quantToAdd, count, dispatch);
    if (status === "success") {
      setCount(count - parseInt(quantToAdd));
    }
    setInProgress(false);
  };

  const renderDisplay = (
    <Container>
      <Paper
        elevation={8}
        sx={{
          //   height: "75vh"
          mt: "2vh",
          maxHeight: { xs: "unset", md: "25vh" },
          maxWidth: "75vw",
          mx: "auto",
        }}
      >
        <Grid
          container
          item
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
            item
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
            {item.Alternate_pictures && item.Alternate_pictures.length > 0 && (
              <div></div>
            )}
          </Grid>
          <Grid
            item
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
                <Container>
                  <Rating rating={overallRating} />
                </Container>
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
          <Grid item xs={12} md={4} margin="auto">
            <Typography>In Cart: {count}</Typography>
            <Typography>Cost: {currencyFormat(item.Price)}</Typography>

            <Typography>
              Total Cost:{" "}
              {
                //@ts-ignore
                currencyFormat(totalCost)
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
                onClick={(event) => removeCartContainer(item)}
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
                value={quantToAdd}
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
                onClick={(event) => pushToCartContainer(item)}
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
  );
  return <div>{isLoading ? <LoadingSpinner /> : renderDisplay}</div>;
}
