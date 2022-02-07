import React, { Component } from "react";
import ReactDOM from "react-dom";

import Dashboard from "./components/Dashboard";


(() => {
  window.reactTree = ReactDOM.render(
    <Dashboard/>,
    document.getElementById("mount")
  );
})();
