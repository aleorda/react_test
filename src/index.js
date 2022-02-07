import React, { Suspense, lazy, Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
const Dashboard = lazy(() => import("./components/Dashboard"));

import Loader from "./components/Loader";

class PageRouter extends Component {
  render() {
    <Router>
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" component={<Dashboard/>} />
            </Routes>
        </Suspense>
    </Router>
  }
}


(() => {
  window.reactTree = ReactDOM.render(
    <PageRouter />,
    document.getElementById("mount")
  );
})();
