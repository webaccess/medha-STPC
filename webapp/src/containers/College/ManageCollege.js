import React, { forwardRef } from "react";
import Layout from "../../hoc/Layout/Layout";
import { Button } from "@material-ui/core";
import * as routeConstants from "../../constants/RouteConstants";
import { NavLink as RouterLink } from "react-router-dom";
import useStyles from "./AddCollegeStyles.js";
import { CustomRouterLink } from "../../components";

const ManageCollege = props => {
  const classes = useStyles();

  return (
    <Layout>
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        to={routeConstants.ADD_COLLEGE}
        component={CustomRouterLink}
      >
        Add College
      </Button>
    </Layout>
  );
};
export default ManageCollege;
