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
import { YellowRouteButton} from "../../../components";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";


const ViewRpc = props => {
  const classes = useStyles();
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
        Manage RPC
        </Typography>

        <YellowRouteButton
          variant="contained"
          color="primary"
          disableElevation
          component={CustomRouterLink}
          to={routeConstants.ADD_RPC}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Add RPC
        </YellowRouteButton>
      </Grid>
      </Grid>
  );
};
export default ViewRpc;
