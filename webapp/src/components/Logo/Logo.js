import React from "react";
import * as routeConstants from "../../constants/RouteConstants";
import siteLogo from "../../assets/images/logo.png";
import styles from "./Logo.module.css";
import { Link } from "react-router-dom";


const logo = props => {
  return (
    <div className={styles.Logo}>
      <Link to={routeConstants.DASHBOARD_URL}>
        <img src={siteLogo} alt="UPSTC-Logo" />
      </Link>
    </div>
  );
};

export default logo;


