import React from "react";
import clsx from "clsx";
import SideAndTopNavBar from "../../components/SideAndTopNavBar/SideAndTopNavBar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import auth from "../../components/Auth/Auth";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 110,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 110
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: "100%",
    backgroundColor: "#f4f6f8",
    padding: "25px",
    minHeight: "640px"
  }
}));

const Layout = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true
  });

  if (auth.getToken() != null && isDesktop) {
    return (
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop
        })}
      >
        <SideAndTopNavBar />
        <main className={classes.content}>{children}</main>
      </div>
    );
  } else {
    return (
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: false
        })}
      >
        <SideAndTopNavBar />
        <main className={classes.content}>{children}</main>
      </div>
    );
  }
};

export default Layout;
