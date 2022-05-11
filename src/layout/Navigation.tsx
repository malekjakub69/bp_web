import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "antd";
import "./style.css";

// Buttons for navigation

function Navigation() {
  return (
    <div className="navigation">
      <Button
        className={"myButton"}
        onClick={() => (window.location.href = "/")}
      >
        Rozvrhy
      </Button>
      <Button
        className={"myButton"}
        onClick={() => (window.location.href = "/participants")}
      >
        Účastníci
      </Button>
      <Button
        className={"myButton"}
        onClick={() => (window.location.href = "/leaders")}
      >
        Vedoucí
      </Button>
      <Button
        className={"myButton"}
        onClick={() => (window.location.href = "/competences")}
      >
        Kompetence
      </Button>
    </div>
  );
}

export default Navigation;
