import React from "react";
import { Link } from "react-router-dom";
import { Props } from "../../Types/Props";
import "./ImageLink.css";
export default function ImageLink(props: Props) {
  return (
    <Link to={"/item/" + props.id} state={{ lastPage: "/" }}>
      <img src={props.img_url} className="img-link" />
    </Link>
  );
}
