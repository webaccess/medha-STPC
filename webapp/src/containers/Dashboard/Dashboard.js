import React, { Component } from "react";
import Layout from "../../hoc/Layout/Layout";
import useStyles from "./Styles";

const Dashboard = () => {
  const classes = useStyles();
  return (
    <Layout>
      <img
        alt="Under development"
        className={classes.image}
        src="/images/underMaintainance.jpg"
      />
    </Layout>
  );
};
export default Dashboard;
