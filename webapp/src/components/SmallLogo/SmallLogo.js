import React from "react";
import * as routeConstants from "../../constants/RouteConstants";
import siteLogo from "../../assets/images/small-logo.png";
import styles from "./SmallLogo.module.css";
import { Link } from "react-router-dom";

const SmallLogo = props => {
  return (
    <div className={styles.Logo}>
      <Link to={routeConstants.DASHBOARD_URL}>
        <img src={siteLogo} alt="UPSTC-Logo" />
      </Link>
    </div>
  );
};

export default SmallLogo;
