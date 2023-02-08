import { Container, Typography, Stack, Button } from "@mui/material";
import React, { Key, useEffect, useState } from "react";
import { api } from "../../Api/api";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectUser } from "../../Slices/UserSlice";
import { Item } from "../../Types/Item";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import setNotification from "../../Common/SendNotification";
import currencyFormat from "../../Common/CurrencyFormat";
import { userItem } from "../../Types/UserItem";
import CartIcon from "@mui/icons-material/ShoppingCart";
import CheckoutContainer from "../checkout/CheckoutContainer";
import "./Cart.css";
import CarouselDisplay from "../carousel/Carousel";
import CartItem from "./CartItem";

export function Cart() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const [counts, setCounts] = useState<Map<string, number>>(new Map());
  const [totalCost, setTotalCost] = useState<number>(0);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [secret, setSecret] = useState<string>("");
  let countMap = new Map();
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
    setIsLoading(true);
    initializePage();
  }, []);

  useEffect(() => {
    if (user.Name.length > 0 && !update) {
      setIsLoading(true);
      initializePage();
    }
  }, [user]);

  const initializePage = () => {
    setUpCount();
    setCounts(countMap);

    api.GetItemsById(user.Cart).then((val) => {
      if (val.message === "Success") {
        setItems(val.response);
      } else {
        setNotification(val.message, "error");
      }
    });
  };

  //calculate the total cost of the cart
  useEffect(() => {
    items?.forEach((i: Item, index) => {
      let c = counts.get(i._id) ? counts.get(i._id) : 0;
      if (c) {
        cost += c * i.Price;
      }
    });

    setTotalCost(cost);
    setIsLoading(false);
  }, [items]);

  const doCheckout = () => {
    api.GetStripeSecret(totalCost, user.Email).then((val) => {
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
          <CartItem
            key={item._id as Key}
            item={item}
            //@ts-ignore
            count={counts && counts.get(item._id) ? counts.get(item._id) : 0}
          />
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
