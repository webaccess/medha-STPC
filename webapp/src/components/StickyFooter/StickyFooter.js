import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { CustomRouterLink } from "../../components";
import * as routeConstants from "../../constants/RouteConstants";
import SwapHorizontalCircleOutlinedIcon from "@material-ui/icons/SwapHorizontalCircleOutlined";
import { IconButton, Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(0, 2),
    marginTop: "auto",
    backgroundColor: "#000",
    color: "#fff"
  },
  changePasswordButton: {
    fontSize: "14px"
  },
  Iconroot: {
    display: "flex",
    alignSelf: "center",
    marginRight: "10px"
  },
  flexGrow: {
    flexGrow: 1
  }
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div>
      <footer className={classes.footer}>
        <Grid container md={12} justify="flex-end"></Grid>
      </footer>
    </div>
  );
}
