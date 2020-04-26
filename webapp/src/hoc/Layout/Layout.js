import React, { useContext } from "react";
import clsx from "clsx";
import { SideAndTopNavBar, StickyFooter } from "../../components";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery, Backdrop, CircularProgress } from "@material-ui/core";
import auth from "../../components/Auth/Auth";
import LoaderContext from "../../context/LoaderContext";
import useStyles from "./LayoutStyles";

const Layout = (props) => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true,
  });
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);
  if (auth.getToken() != null && isDesktop) {
    return (
      <React.Fragment>
        <div
          className={clsx({
            [classes.root]: true,
            [classes.shiftContent]: isDesktop,
          })}
        >
          <SideAndTopNavBar />
          <main className={classes.content}>{children}</main>
        </div>
        <StickyFooter />
        <Backdrop className={classes.backdrop} open={loaderStatus}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div
          className={clsx({
            [classes.root]: true,
            [classes.shiftContent]: false,
          })}
        >
          <SideAndTopNavBar />
          <main className={classes.content}>{children}</main>
          <StickyFooter />
        </div>
        <Backdrop className={classes.backdrop} open={loaderStatus}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </React.Fragment>
    );
  }
};

export default Layout;
