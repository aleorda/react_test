import React, { Fragment } from "react";
import styles from "../styles/style.scss";

import { Helmet } from "react-helmet";


export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Fragment>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
        </Fragment>
    );
  }
}

export default Dashboard;
