import React from "../../node_modules/react";
import { Route, Redirect } from "../../node_modules/react-router-dom";
import PropTypes from "../../node_modules/prop-types";
import auth from "../components/Auth/Auth";
import * as routeConstants from "../constants/RouteConstants";
import MenuItems from "../components/SideAndTopNavBar/Component/MenuItems.js";
import { Tabs, Tab } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { get } from "lodash";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "../components";
import { includes } from "lodash";

const StyledTabs = withStyles({
  root: {},
  indicator: {
    backgroundColor: "#006000"
  }
})(Tabs);

const StyledTab = withStyles(theme => ({
  root: {
    color: "#000000",
    textTransform: "uppercase",
    minWidth: 80,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: "12px",
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      color: "#43a047",
      opacity: 1
    },
    "&$selected": {
      color: "#006000",
      fontWeight: theme.typography.fontWeightBold
    },
    "&:focus": {
      color: "#43a047"
    }
  },
  selected: {}
}))(props => <Tab disableRipple {...props} />);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: "16px",
    textTransform: "uppercase"
  },
  padding: {
    padding: theme.spacing(3)
  },
  marginY: {
    marginBottom: "16px",
    marginTop: "8px"
  }
}));

const RouteWithTabLayout = props => {
  const { layout: Layout, component: Component, title, ...rest } = props;
  let history = useHistory();
  const classes = useStyles();

  const menu = get(
    MenuItems(),
    auth.getUserInfo() ? auth.getUserInfo()["role"]["name"] : "",
    []
  );

  /**
   * Get tabs for only sub menu items from menu only for profile
   */
  const tabs = menu ? menu[0].tabItems : menu;

  const isURLValid = includes(
    tabs.map(t => t.link),
    props.path
  );
  console.log(isURLValid);

  // Default selected tab view-profile
  const [selectedTab, setSelectedTab] = useState(
    isURLValid ? props.path : "/view-profile"
  );

  useEffect(() => {
    if (selectedTab) {
      history.push(selectedTab);
    }
  }, [selectedTab]);

  const NavBar = () => {
    const handleTabChange = val => {
      setSelectedTab(val);
    };

    return (
      <div className={classes.root}>
        <Typography className={classes.marginY} variant="h4">
          {title || ""}
        </Typography>
        <StyledTabs
          variant="fullWidth"
          value={selectedTab}
          onChange={(event, value) => handleTabChange(value)}
        >
          {tabs.map((tab, index) => {
            return <StyledTab label={tab.name} value={tab.link} key={index} />;
          })}
        </StyledTabs>
      </div>
    );
  };

  if (auth.getToken() !== null) {
    return (
      <Route
        {...rest}
        render={matchProps => (
          <Layout>
            <NavBar />
            <Component {...matchProps} />
          </Layout>
        )}
      />
    );
  } else {
    return (
      <Redirect
        to={{
          pathname: routeConstants.SIGN_IN_URL,
          state: { from: props.location }
        }}
      />
    );
  }
};

RouteWithTabLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithTabLayout;
