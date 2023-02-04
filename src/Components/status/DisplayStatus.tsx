import { Paper, Typography } from "@mui/material";
import React from "react";
import { Props } from "../../Types/Props";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

export default function DisplayStatus(props: Props) {
  console.log(props);
  return (
    <Paper>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography>{props.status}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
