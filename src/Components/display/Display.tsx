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
import { selectUser } from "../../Slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectNotification } from "../../Slices/NotificationSlice";
import { Link } from "react-router-dom";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import CarouselDisplay from "../carousel/Carousel";
import { pushToCart } from "../../Common/CartManagement";
import "./Display.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

export default function Display() {
  const theme = useTheme();
  const user = useAppSelector(selectUser);
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([]);
  let selectedPage = "1";

  const getItems = function () {
    api.GetItems(page - 1).then((e) => {
      if (e) {
        setItems(e);
      } else {
        setIsLoading(false);
      }
    });
  };

  const getCount = function () {
    api.GetCountItems().then((e) => {
      if (e) {
        //calculate the valid page numbers
        let numberOfItems = e;
        let numberOfPages = numberOfItems / 12;
        numberOfPages = parseInt(numberOfPages.toString());

        let i = 0;
        let tempArr: number[] = [];
        while (i <= numberOfPages) {
          tempArr.push(i++ + 1);
        }
        setPages(tempArr);
      }
    });
  };

  useEffect(() => {
    if (pages.length > 0 && items.length > 0) {
      setIsLoading(false);
    }
  }, [pages, items]);

  useEffect(() => {
    setIsLoading(true);
    getItems();
    getCount();
  }, []);

  const pushToCartContainer = async (item: Item) => {
    setInProgress(true);
    let count: number = -1;
    let index: number = user.Cart.findIndex((e) => {
      return e.id === item._id;
    });
    if (index >= 0) {
      count = user.Cart[index].count;
    }
    if (count === -1) {
      count = 0;
    }
    await pushToCart(user, item, "1", count, dispatch);
    setInProgress(false);
  };

  const changePage = function (event: SelectChangeEvent) {
    let val = parseInt(event.target.value);
    if (val != page) {
      selectedPage = val.toString();
      setPage(val);
    }
  };

  useEffect(() => {
    getItems();
  }, [page]);

  const renderPageMenu = (
    <FormControl>
      <InputLabel>Page</InputLabel>
      <Select value={page.toString()} label="Page" onChange={changePage}>
        {pages.map((page) => {
          return (
            <MenuItem value={page} key={page}>
              {page}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );

  const renderDisplay = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
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
                <Grid
                  item
                  key={i._id as Key}
                  xs={7}
                  sm={4}
                  md={3}
                  className="margin-auto"
                >
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
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
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
                          pushToCartContainer(i);
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
        <div>{pages.length > 0 ? renderPageMenu : <></>}</div>
      </main>
      <hr />
      <CarouselDisplay />
    </ThemeProvider>
  );
  return <div>{isLoading ? <LoadingSpinner /> : renderDisplay}</div>;
}
