import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import ImageLink from "./ImageLink";
import { Card, Container } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../Slices/UserSlice";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { motion } from "framer-motion";

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
    console.log(displayElements[0]);
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
            {/* <motion.div
              animate={{ opacity: 0 }}
              transition={{ ease: "easeOut", duration: 1 }}
            > */}
            <Card
              sx={{
                opacity: "50%",
              }}
            >
              {displayElements[displayElements.length - 1]}
            </Card>
            {/* </motion.div> */}
          </Grid2>
          <Grid2 xs={4}>
            {/* <motion.div
              animate={{ opacity: 0.5, x: -250 }}
              transition={{ ease: "easeOut", duration: 1 }}
            > */}
              <Card
                sx={{
                  zIndex: "10",
                }}
              >
                {displayElements[0]}
              </Card>
            {/* </motion.div> */}
          </Grid2>
          <Grid2 xs={3}>
            {/* <motion.div
              animate={{ opacity: 2, x: -250 }}
              transition={{ ease: "easeOut", duration: 1 }}
            > */}
              <Card
                sx={{
                  opacity: "50%",
                }}
              >
                {displayElements[1]}
              </Card>
            {/* </motion.div> */}
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
