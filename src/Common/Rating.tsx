import { Container, Typography } from "@mui/material";
import React, { useState } from "react";
import StarsIcon from "@mui/icons-material/Stars";
interface Props {
  rating: number;
}
export default function Rating(props: Props) {
  const [rating, setRating] = useState(props.rating);
  if (rating === 0 && props.rating > 0) {
    setRating(props.rating);
  } else if (props.rating === -1 && rating != -1) {
    setRating(-1);
  }

  return (
    <Container>
      <Typography className="rating">
        {!isNaN(parseFloat(rating.toString())) && rating > -1
          ? rating + "/5"
          : "No ratings yet"}
        {rating > -1 && <StarsIcon fontSize="small" className="star" />}
      </Typography>
    </Container>
  );
}
