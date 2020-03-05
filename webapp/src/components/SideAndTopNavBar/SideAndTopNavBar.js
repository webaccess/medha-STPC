import React, { forwardRef } from "react";
import { get } from "lodash";
import clsx from "clsx";
import { NavLink as RouterLink } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  IconButton,
  colors,
  AppBar,
  Toolbar,
  List,
  Divider,
  Drawer,
  Hidden,
  ListItem,
  Collapse,
  Button,
  InputLabel
} from "@material-ui/core";

import { ExpandLess, ExpandMore } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import InputIcon from "@material-ui/icons/Input";

import * as routeConstants from "../../constants/RouteConstants";
import Logo from "../Logo/Logo";
import MenuItems from "./Component/MenuItems";
import { Auth as auth, CustomRouterLink } from "../../components";
import { fontSize } from "@material-ui/system";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";

const useDrawerStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up("lg")]: {
      marginTop: 64,
      height: "calc(100% - 64px)"
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxShadow: "none",
    marginTop: "30px"
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const useTopBarStyles = makeStyles(theme => ({
  root: {
    boxShadow: "none",
    backgroundColor: "#000000"
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    // marginLeft: theme.spacing(1)
    fontSize: "13px"
  },
  loginButtonFlex: {
    display: "flex",
    flexGrow: "1",
    "& icon": {
      display: "flex",
      alignSelf: "center"
    },
    "& label": {
      color: "#fff",
      alignItems: "center",
      display: "flex",
      marginRight: "15px"
    }
  },
  Iconroot: {
    display: "flex",
    alignSelf: "center",
    marginRight: "10px"
  }
}));

const useListStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: "flex",
    paddingTop: "0",
    paddingBottom: "0",
    margin: "0px"
  },
  button: {
    color: colors.blueGrey[800],
    padding: "8px 0px 8px 10px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: "0px",
    backgroundColor: "#fff",
    borderLeft: "4px solid #fff",
    color: "#010101",
    textTransform: "Uppercase",
    "&:hover": {
      backgroundColor: "#fff7d8",
      color: "010101",
      borderLeft: "4px solid #f6c80a"
    }
  },

  "@global": {
    "li > button:nth-of-type(1)": {
      backgroundColor: "#666",
      color: "#f6c80a",
      borderLeft: "4px solid #f6c80a"
    }
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(2),
    color: "#010101"
  },
  active: {
    color: "#010101",
    backgroundColor: "#f1f1f1",
    fontWeight: theme.typography.fontWeightBold
    // borderLeft: "4px solid #f6c80a",
    // "& $icon": {
    //   color: "#010101"
    // }
  },
  nested: {
    paddingLeft: theme.spacing(0),
    paddingTop: 0,
    paddingBottom: 0,
    "& a": {
      fontSize: "13px",
      paddingLeft: "51px",
      paddingTop: "5px",
      paddingBottom: "5px",
      textTransform: "Capitalize",
      color: "010101",
      "&:active": {
        backgroundColor: "#f1f1f1",
        color: "010101"
      },
      "&:hover": {
        backgroundColor: "#f1f1f1",
        color: "010101",
        borderLeft: "4px solid #f1f1f1"
      }
    }
  }
}));

function SideAndTopNavBar(props) {
  const { container, className, ...rest } = props;
  const classes = useDrawerStyles();
  const topBarClasses = useTopBarStyles();
  const listClasses = useListStyles();

  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [subListState, setSubListState] = React.useState({});

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = name => {
    setSubListState({ ...subListState, [name]: !get(subListState, name) });
  };

  const inputs = get(MenuItems(), ["Medha_Admin"], []);

  const drawer = (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.toolbar} />

      {inputs.map(list => {
        return (
          <div key={list.name}>
            {list.items != null ? (
              <List {...rest} className={clsx(listClasses.root, className)}>
                <ListItem
                  className={listClasses.item}
                  disableGutters
                  key={list.name}
                  onClick={e => handleClick(list.name)}
                >
                  <Button
                    activeClassName={listClasses.active}
                    className={listClasses.button}
                  >
                    <div className={listClasses.icon}>{list.Icon}</div>
                    {list.name}
                    {get(subListState, list.name) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </Button>
                </ListItem>
                <Collapse
                  in={get(subListState, list.name)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {list.items.map(subList => {
                      return (
                        <ListItem
                          className={(listClasses.item, listClasses.nested)}
                          disableGutters
                          key={subList.name}
                        >
                          <Button
                            activeClassName={listClasses.active}
                            className={listClasses.button}
                            component={CustomRouterLink}
                            to={subList.link}
                          >
                            {subList.name}
                          </Button>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </List>
            ) : (
              <List {...rest} className={clsx(listClasses.root, className)}>
                <ListItem
                  className={listClasses.item}
                  disableGutters
                  key={list.name}
                >
                  <Button
                    activeClassName={listClasses.active}
                    className={listClasses.button}
                    component={CustomRouterLink}
                    to={list.link}
                  >
                    <div className={listClasses.icon}>{list.Icon}</div>
                    {list.name}
                  </Button>
                </ListItem>
              </List>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={topBarClasses.root}>
      <AppBar position="fixed" className={topBarClasses.root}>
        <Toolbar>
          <Logo />
          {auth.getToken() !== null ? (
            <div className={topBarClasses.loginButtonFlex}>
              <div className={topBarClasses.flexGrow} />
              <Hidden mdDown>
                {/* <IconButton
                  className={topBarClasses.signOutButton}
                  color="inherit"
                  component={CustomRouterLink}
                  to={routeConstants.LOGOUT_URL}
                >
                  <InputIcon />
                </IconButton> */}
                <div className={topBarClasses.Iconroot}>
                  <AccountCircleOutlinedIcon />
                </div>
                <InputLabel>
                  {"Welcome "}
                  {/* {auth.getUserInfo()["first_name"] +
                    " " +
                    auth.getUserInfo()["last_name"]} */}
                </InputLabel>
                <IconButton
                  className={topBarClasses.signOutButton}
                  color="inherit"
                  component={CustomRouterLink}
                  to={routeConstants.LOGOUT_URL}
                >
                  <div className={topBarClasses.Iconroot}>
                    <InputIcon />
                  </div>
                  SIGN OUT
                </IconButton>

                <Drawer
                  classes={{
                    paper: classes.drawer
                  }}
                  anchor="left"
                  variant="permanent"
                  open
                >
                  {drawer}
                </Drawer>
              </Hidden>
              <Hidden lgUp>
                <IconButton color="inherit" onClick={handleDrawerToggle}>
                  <MenuIcon />
                </IconButton>
                <Drawer
                  container={container}
                  variant="temporary"
                  anchor={theme.direction === "rtl" ? "right" : "left"}
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  classes={{
                    paper: classes.drawerPaper
                  }}
                  ModalProps={{
                    keepMounted: true // Better open performance on mobile.
                  }}
                >
                  {drawer}
                </Drawer>
              </Hidden>
            </div>
          ) : (
            ""
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default SideAndTopNavBar;
