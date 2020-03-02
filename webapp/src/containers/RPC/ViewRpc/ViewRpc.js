import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";
import useStyles from "./ViewRpcStyles.js";
import { CustomRouterLink } from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";

const ViewRpc = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.header}>
            Manage RPC
          </Typography>
        </Grid>
        <Grid item xs>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            className={classes.addRpcButton}
            component={CustomRouterLink}
            to={routeConstants.ADD_RPC}
          >
            Add Rpc
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default ViewRpc;
