import React, { useEffect, useState } from "react";

import ImageLink from "./ImageLink";
import { Card, Container } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../Slices/UserSlice";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

import "./Carousel.css";
export default function CarouselDisplay() {
  const user = useAppSelector(selectUser);
  const [slides, setSlides] = useState<JSX.Element[]>([]);
  const [showSlides, setShowSlides] = useState(false);
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

interface carouselProp {
  elements: JSX.Element[];
  autoplay: boolean;
  interval: number;
}

function CaroselD(props: carouselProp) {
  const [displayElements, setDisplayElements] = useState(props.elements);
  const [rerender, setRerender] = useState(false);

  const rotate = (reverse: boolean) => {
    let tempArray = displayElements;
    //@ts-ignore
    if (reverse) tempArray.unshift(tempArray.pop());
    //@ts-ignore
    else tempArray.push(tempArray.shift());
    setDisplayElements(tempArray);
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
          <Grid2 xs={1}>
            <ArrowBackIos
              fontSize="large"
              className="arrow"
              onClick={() => {
                rotate(true);
              }}
            />
          </Grid2>

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
              {displayElements[0]}
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
          <Grid2 xs={1}>
            <ArrowForwardIos
              fontSize="large"
              className="arrow"
              onClick={() => {
                rotate(false);
              }}
            />
          </Grid2>
        </Grid2>
      )}
    </Container>
  );
  return <div>{renderElements}</div>;
}
