import React from "react";
import clsx from "clsx";
import SideAndTopNavBar from "../../components/Navigation/SideAndTopNavBar/SideAndTopNavBar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: "100%"
  }
}));

const Layout = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true
  });

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
};

export default Layout;
