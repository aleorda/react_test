import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import Dashboard from "./components/Dashboard";

(() => {
  window.reactTree = ReactDOM.render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>,
    document.getElementById("mount")
  );
})();
