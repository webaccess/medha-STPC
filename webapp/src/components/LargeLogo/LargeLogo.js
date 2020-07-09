import React from "react";
import * as routeConstants from "../../constants/RouteConstants";
import siteLogo from "../../assets/images/small-logo.png";
import styles from "./LargeLogo.module.css";
import { Link } from "react-router-dom";

const LargeLogo = props => {
  return (
    <div className={styles.Logo}>
      <Link to={routeConstants.DASHBOARD_URL}>
        <img src={siteLogo} alt="UPSTC-Logo" />
      </Link>
    </div>
  );
};

export default LargeLogo;
