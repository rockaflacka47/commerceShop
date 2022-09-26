import { Card, CardContent, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Props } from "../../Types/Props";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../Slices/UserSlice";
import { Item } from "../../Types/Item";
import { api } from "../../Api/api";
import setNotification from "../../Common/SendNotification";
import { userItem } from "../../Types/UserItem";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import currencyFormat from "../../Common/CurrencyFormat";

export default function SuccessStatus() {
  const user = useAppSelector(selectUser);
  const [order, setOrder] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [counts, setCounts] = useState<Map<string, number>>(new Map());
  const [totalCost, setTotalCost] = useState<Number>(0);
  let countMap = new Map();

  const setUpCount = () => {
    user.Cart.forEach((i: userItem) => {
      countMap.set(i.id, i.count);
    });
  };

  const initializePage = () => {
    setIsLoading(true);
    setUpCount();
    setCounts(countMap);
    api.GetItemsById(user.Cart).then((val) => {
      setIsLoading(false);
      if (val.message === "Success") {
        let cost = 0;
        val.response.map((i) => {
          let c = counts.get(i._id) ? counts.get(i._id) : 0;
          if (c) {
            cost += c * i.Price;
          }
        });
        setTotalCost(cost);
        setOrder(val.response);
      } else {
        setNotification(val.message, "error");
      }
    });
  };
  useEffect(() => {
    if (user.Cart.length) {
      initializePage();
    }
  }, []);

  useEffect(()=>{
    if (user.Cart.length) {
        initializePage();
      }
  }, [user])

  const renderStatus = (
    <Paper>
      <Grid container spacing={2}>
        <Grid
          xs={12}
          sx={{
            background: "lightgreen",
          }}
        >
          <Typography variant="h3">Order Successful</Typography>
        </Grid>
        {order.length > 0 && (
          <Grid xs={12} md={9}>
            <Stack
              sx={{
                width: { xs: "100%", md: "90%" },
                margin: "auto",
              }}
            >
              {order.map((item) => (
                <Card key={item._id}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>{item.Name} </Typography>
                    <Typography>x {counts.get(item._id)}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
        )}
        <Grid
          xs={12}
          md={3}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "unset" },
          }}
        >
          {totalCost && (
            <Typography>Total Cost: {currencyFormat(totalCost)}</Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );

  return <div>{isLoading ? <LoadingSpinner /> : renderStatus}</div>;
}
