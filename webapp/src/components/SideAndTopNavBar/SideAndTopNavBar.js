import React, { useState, useContext } from "react";
import { get } from "lodash";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  IconButton,
  colors,
  AppBar,
  Toolbar,
  List,
  Drawer,
  Hidden,
  ListItem,
  Collapse,
  Button,
  InputLabel,
  ListItemIcon,
  Divider,
  Box,
  Typography,
  Avatar
} from "@material-ui/core";
import SwapHorizontalCircleOutlinedIcon from "@material-ui/icons/SwapHorizontalCircleOutlined";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import InputIcon from "@material-ui/icons/Input";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import * as routeConstants from "../../constants/RouteConstants";
import Logo from "../Logo/Logo";
import MenuItems from "./Component/MenuItems";
import { Auth as auth, CustomRouterLink } from "../../components";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import SetIndexContext from "../../context/SetIndexContext";
import SmallLogo from "../SmallLogo/SmallLogo";
import LargeLogo from "../LargeLogo/LargeLogo";

const useDrawerStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up("lg")]: {
      marginTop: 64,
      height: "calc(100% - 128px)"
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxShadow: "none",
    marginTop: "25px"
  },
  navigationpanel: {
    margin: theme.spacing(0)
  },
  divider: {
    margin: theme.spacing(4, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  logoBox: {
    display: "flex",
    padding: "16px",
    justifyContent: "center"
  },
  smallLogoBox: {
    display: "flex",
    padding: "10px",
    justifyContent: "center"
  },
  logoStudentBox: {
    display: "flex",
    justifyContent: "center"
  },
  avatarLogo: {
    height: "100px",
    width: "100px",
    backgroundColor: "#EDEDED"
  },
  userContentBox: {
    padding: "16px",
    textAlign: "center"
  },
  body2Style: {
    fontSize: "14px",
    lineHeight: "25px"
  },
  mainBox: {
    marginRight: "50px",
    marginLeft: "50px"
  },
  authStyle: {
    padding: "16px"
  },
  dividerStyle: {
    margin: theme.spacing(4, 0, 2, 0)
  },
  mainDesktopBox: {
    marginTop: "50px",
    marginLeft: "43px",
    marginRight: "50px"
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
    fontSize: "14px"
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
  },
  changePasswordButton: {
    fontSize: "14px"
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
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: "0px",
    backgroundColor: "#fff",
    borderLeft: "4px solid #fff",
    fontSize: "12px",
    color: "#010101",
    textTransform: "Uppercase",
    "&:hover": {
      backgroundColor: "#fff7d8",
      color: "010101",
      borderLeft: "4px solid #f6c80a"
    }
  },
  activeItem: {
    backgroundColor: "#666",
    color: "#f6c80a",
    borderLeft: "4px solid #f6c80a"
  },
  active: {
    color: "#010101",
    backgroundColor: "#f1f1f1",
    fontWeight: theme.typography.fontWeightBold
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
  },
  padding: {
    paddingTop: "0px",
    paddingBottom: "0px"
  },
  expandPadding: {
    paddingRight: "10px"
  }
}));

function SideAndTopNavBar(props) {
  const { container, className, ...rest } = props;
  const classes = useDrawerStyles();
  const topBarClasses = useTopBarStyles();
  const listClasses = useListStyles();

  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [subListState, setSubListState] = useState({});

  const { index, setIndex } = useContext(SetIndexContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = name => {
    setSubListState({ ...subListState, [name]: !get(subListState, name) });
  };

  const authMenuItems = [
    {
      name: "Auth",
      Icon: <AccountCircleOutlinedIcon />,
      items: [
        {
          name: "Change Password",
          link: routeConstants.CHANGE_PASSWORD,
          Icon: <SwapHorizontalCircleOutlinedIcon />
        },
        {
          name: "Sign Out",
          link: routeConstants.LOGOUT_URL,
          Icon: <InputIcon />
        }
      ]
    }
  ];

  const inputs = get(
    MenuItems(),
    auth.getUserInfo() ? auth.getUserInfo()["role"]["name"] : "",
    []
  );

  const title = () => {
    const userInfo = auth.getUserInfo();
    return userInfo["first_name"]
      ? `${userInfo["first_name"]} ${userInfo["last_name"]}`
      : userInfo.username;
  };

  const role = () => {
    const userInfo = auth.getUserInfo();
    return userInfo["role"]["name"];
  };

  const drawer = (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.toolbar} />
      {inputs.map((list, id) => {
        return (
          <div key={list.name} className={listClasses.navigationpanel}>
            {list.items != null ? (
              <List
                {...rest}
                className={clsx(
                  listClasses.root,
                  className,
                  listClasses.padding
                )}
              >
                <ListItem
                  className={listClasses.button}
                  disableGutters
                  key={list.name}
                  onClick={e => handleClick(list.name)}
                  selected={index === id}
                >
                  <ListItemIcon>{list.Icon}</ListItemIcon>
                  {list.name}
                  <div className={topBarClasses.flexGrow} />
                  <div className={listClasses.expandPadding}>
                    {get(subListState, list.name) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </div>
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
                            onClick={() => setIndex(id)}
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
              <List
                {...rest}
                className={clsx(
                  listClasses.root,
                  className,
                  listClasses.padding
                )}
              >
                <ListItem
                  className={listClasses.button}
                  disableGutters
                  key={list.name}
                  selected={index === id}
                  component={CustomRouterLink}
                  to={list.link}
                  onClick={() => setIndex(id)}
                >
                  <ListItemIcon>{list.Icon}</ListItemIcon>
                  {list.name}
                </ListItem>
              </List>
            )}
          </div>
        );
      })}
      <Hidden lgUp>
        <Divider className={classes.dividerStyle} />
        {authMenuItems.map(list => {
          return (
            <div key={list.name} className={listClasses.navigationpanel}>
              {list.items != null ? (
                <List
                  {...rest}
                  className={clsx(
                    listClasses.root,
                    className,
                    listClasses.padding
                  )}
                >
                  <ListItem
                    className={listClasses.button}
                    disableGutters
                    key={list.name}
                    onClick={e => handleClick(list.name)}
                  >
                    <ListItemIcon>{list.Icon}</ListItemIcon>
                    {list.name}
                    <div className={topBarClasses.flexGrow} />
                    <div className={listClasses.expandPadding}>
                      {get(subListState, list.name) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </div>
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
                ""
              )}
            </div>
          );
        })}
      </Hidden>
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
                <div className={topBarClasses.Iconroot}>
                  <AccountCircleOutlinedIcon />
                </div>
                <InputLabel>
                  {"Welcome "}
                  {title()}
                </InputLabel>
                <IconButton
                  className={topBarClasses.changePasswordButton}
                  color="inherit"
                  component={CustomRouterLink}
                  to={routeConstants.CHANGE_PASSWORD}
                >
                  <div className={topBarClasses.Iconroot}>
                    <SwapHorizontalCircleOutlinedIcon />
                  </div>
                  Change Password
                </IconButton>
                <IconButton
                  className={topBarClasses.signOutButton}
                  color="inherit"
                  component={CustomRouterLink}
                  to={routeConstants.LOGOUT_URL}
                >
                  <div className={topBarClasses.Iconroot}>
                    <InputIcon />
                  </div>
                  Sign out
                </IconButton>

                <Drawer
                  classes={{
                    paper: classes.drawer
                  }}
                  anchor="left"
                  variant="permanent"
                  open
                >
                  <Box className={classes.mainDesktopBox}>
                    {auth.getUserInfo().role.name === "Student" &&
                    auth.getUserInfo().studentInfo.profile_photo &&
                    auth.getUserInfo().studentInfo.profile_photo.url ? (
                      <Box className={classes.logoStudentBox}>
                        <Avatar
                          alt={title()}
                          src={
                            strapiApiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                            auth.getUserInfo().studentInfo.profile_photo.url
                          }
                          className={classes.avatarLogo}
                        />
                      </Box>
                    ) : auth.getUserInfo().role.name === "Student" ? (
                      <Box className={classes.logoStudentBox}>
                        <Avatar
                          alt={title()}
                          src=""
                          className={classes.avatarLogo}
                        />
                      </Box>
                    ) : (
                      <Box className={classes.logoBox}>
                        <LargeLogo />
                      </Box>
                    )}

                    <Box className={classes.userContentBox}>
                      <Typography variant="h5" component="h5">
                        {title()}
                      </Typography>
                    </Box>
                  </Box>
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
                  {/* <Hidden lgUp> */}
                  <Box className={classes.mainBox}>
                    {auth.getUserInfo().role.name === "Student" &&
                    auth.getUserInfo().studentInfo.profile_photo &&
                    auth.getUserInfo().studentInfo.profile_photo.url ? (
                      <React.Fragment>
                        <Box className={classes.smallLogoBox}>
                          <SmallLogo />
                        </Box>
                        <Box className={classes.logoStudentBox}>
                          <Avatar
                            alt={title()}
                            src={
                              strapiApiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                              auth.getUserInfo().studentInfo.profile_photo.url
                            }
                            className={classes.avatarLogo}
                          />
                        </Box>
                      </React.Fragment>
                    ) : auth.getUserInfo().role.name === "Student" ? (
                      <React.Fragment>
                        <Box className={classes.smallLogoBox}>
                          <SmallLogo />
                        </Box>
                        <Box className={classes.logoStudentBox}>
                          <Avatar
                            alt={title()}
                            src=""
                            className={classes.avatarLogo}
                          />
                        </Box>
                      </React.Fragment>
                    ) : (
                      <Box className={classes.logoBox}>
                        <LargeLogo />
                      </Box>
                    )}

                    <Box className={classes.userContentBox}>
                      <Typography variant="h5" component="h5">
                        {title()}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={classes.body2Style}
                      >
                        {role()}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  {/* </Hidden> */}

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
