import React from "../../node_modules/react";
import { Route, Redirect } from "../../node_modules/react-router-dom";
import PropTypes from "../../node_modules/prop-types";
import auth from "../components/Auth/Auth";
import * as routeConstants from "../constants/RouteConstants";
import MenuItems from "../components/SideAndTopNavBar/Component/MenuItems.js";
import {
  createMuiTheme,
  ThemeProvider,
  Tabs,
  Tab,
  Paper
} from "@material-ui/core";
import { get } from "lodash";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const RouteWithTabLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  let history = useHistory();
  // Default selected tab view-profile
  const [selectedTab, setSelectedTab] = useState("/view-profile");

  useEffect(() => {
    if (selectedTab) {
      history.push(selectedTab);
    }
  }, [selectedTab]);

  const overrideTabsTheme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiTabs: {
        // Name of the rule
        flexContainer: {
          display: "flex",
          flexDirection: "row-reverse",
          background: "#f4f6f8",
          borderRadius: 0
        },
        indicator: {
          backgroundColor: "#F6C80A",
          height: "4px"
        },
        root: {
          backgroundColor: "#f4f6f8"
        }
      },
      MuiButtonBase: {
        root: {
          color: "white !important"
        }
      },
      MuiTab: {
        root: {
          minHeight: "32px",
          textTransform: "capitalize",
          fontWeight: 400,
          marginLeft: "8px",
          marginTop: "8px"
        },
        textColorPrimary: {
          background: "#333333"
        }
      },
      MuiPaper: {
        elevation1: {
          boxShadow: "none"
        },
        rounded: {
          borderRadius: "0px"
        }
      }
    }
  });

  const menu = get(
    MenuItems(),
    auth.getUserInfo() ? auth.getUserInfo()["role"]["name"] : "",
    []
  );

  /**
   * Get tabs for only sub menu items from menu only for profile
   */
  const tabs = menu ? menu[0].tabItems : menu;

  const NavBar = () => {
    const handleTabChange = val => {
      setSelectedTab(val);
    };

    return (
      <div>
        <ThemeProvider theme={overrideTabsTheme}>
          <Paper>
            <Tabs
              value={selectedTab}
              onChange={(event, value) => handleTabChange(value)}
              indicatorColor="primary"
              textColor="primary"
            >
              {tabs.map(tab => {
                return <Tab label={tab.name} value={tab.link} />;
              })}
            </Tabs>
          </Paper>
        </ThemeProvider>
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
