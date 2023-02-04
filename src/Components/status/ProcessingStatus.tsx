import { Paper, Typography } from "@mui/material";
import React from "react";
import { Props } from "../../Types/Props";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

export default function ProcessingStatus() {
  return (
    <Paper>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography></Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
