import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import Dashboard from "./components/Dashboard";

(() => {
  window.reactTree = ReactDOM.render(
    <Dashboard />,
    document.getElementById("mount")
  );
})();
