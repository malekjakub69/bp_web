import React from "react";
import Navigation from "./Navigation";
import "./style.css";

//Header

function MyHeader() {
  return (
    <div className="myHeader">
      <h1 className={"HeaderName"}>Skautské rozvhry</h1>
      <Navigation />
    </div>
  );
}

export default MyHeader;
