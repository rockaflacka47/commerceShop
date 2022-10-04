import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

//@ts-ignore
import { Carousel } from "3d-react-carousal";
import ImageLink from "./ImageLink";
import { Card, CardMedia, Container, IconButton } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../Slices/UserSlice";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ArrowBack, ArrowForward, RotateLeft } from "@mui/icons-material";
import { display } from "@mui/system";

import "./Carousel.css";
export default function CarouselDisplay() {
  const user = useAppSelector(selectUser);
  const [slides, setSlides] = useState<JSX.Element[]>([]);
  const [showSlides, setShowSlides] = useState(false);
  //   let slides = [];
  const createArray = () => {
    let tempArray: JSX.Element[] = [];
    user.RecentlyViewed.forEach((val) => {
      tempArray.push(
        <ImageLink id={val.id} img_url={val.img_url} name={val.name} />
      );
    });
    setSlides(tempArray);
    setShowSlides(true);
  };

  //   useEffect(() => {
  //     if (user.Name.length > 0) {
  //       createArray();
  //     }
  //   }, []);

  useEffect(() => {
    if (user.Name.length > 0) {
      createArray();
    }
  }, [user]);

  return (
    <Container>
      {showSlides && (
        <>
          <h3>Recently Viewed</h3>
          {/* <Carousel slides={slides} autoplay={true} interval={5000} /> */}
          <CaroselD elements={slides} autoplay={true} interval={5000} />
        </>
      )}
    </Container>
  );
}

function CaroselD(props) {
  const [displayElements, setDisplayElements] = useState(props.elements);
  const [rerender, setRerender] = useState(false);

  const rotate = (reverse) => {
    let tempArray = displayElements;
    if (reverse) tempArray.unshift(tempArray.pop());
    else tempArray.push(tempArray.shift());
    setDisplayElements(tempArray);
    console.log(displayElements[0])
    setRerender(!rerender);
  };

  useEffect(() => {
    if (props.autoplay) {
      setTimeout(() => rotate(false), props.interval ? props.interval : 2000);
    }
  }, [rerender]);
  const renderElements = (
    <Container
      sx={{
        justifyContent: "center",
      }}
    >
      {displayElements.length > 0 && (
        <Grid2
          container
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid2 xs={3}>
            <Card
              sx={{
                opacity: "50%",
              }}
            >
              {displayElements[displayElements.length - 1]}
            </Card>
          </Grid2>
          <Grid2 xs={4}>
            <Card
              sx={{
                zIndex: "10",
              }}
            >
              <ArrowBack
                className="back arrow"
                onClick={() => {
                  rotate(true);
                }}
              />
              {displayElements[0]}
              {/* <Container className=""> */}
                <ArrowForward
                  className="forward arrow"
                  onClick={() => {
                    rotate(false);
                  }}
                />
              {/* </Container> */}
            </Card>
          </Grid2>
          <Grid2 xs={3}>
            <Card
              sx={{
                opacity: "50%",
              }}
            >
              {displayElements[1]}
            </Card>
          </Grid2>
        </Grid2>
      )}
    </Container>
  );
  return <div>{renderElements}</div>;
}
