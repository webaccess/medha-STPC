import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import menuItems from "./menuItems.json";
import { get } from "lodash";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Logo from "../../Logo/Logo";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { IconButton, colors } from "@material-ui/core";
import InputIcon from "@material-ui/icons/Input";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  drawer: {
    width: 240,
    [theme.breakpoints.up("lg")]: {
      marginTop: 64,
      height: "calc(100% - 64px)"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  nested: {
    paddingLeft: theme.spacing(4),
    paddingTop: 0,
    paddingBottom: 0
  },
  flexGrow: {
    flexGrow: 1
  },
  button: {
    color: colors.blueGrey[800],
    padding: "10px 8px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    "& $icon": {
      color: theme.palette.primary.main
    }
  },
  item: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0
  }
}));

function SideAndTopNavBar(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [subListState, setSubListState] = React.useState({});

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = name => {
    setSubListState({ ...subListState, [name]: !get(subListState, name) });
  };

  const inputs = get(menuItems, ["SuperAdmin"], []);

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />

      {inputs.map(list => {
        return (
          <div key={list.name}>
            {list.items != null ? (
              <List component="nav" aria-labelledby="nested-list-subheader">
                <ListItem
                  button
                  onClick={e => handleClick(list.name)}
                  className={classes.item}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={list.name}
                    activeclassname={classes.active}
                    className={classes.button}
                  />
                  {get(subListState, list.name) ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
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
                          button
                          className={classes.nested}
                          key={subList.name}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={subList.name}
                            activeclassname={classes.active}
                            className={classes.button}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </List>
            ) : (
              <List component="nav" aria-labelledby="nested-list-subheader">
                <ListItem button className={classes.item}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    component={Link}
                    to={list.link}
                    primary={list.name}
                    activeclassname={classes.active}
                    className={classes.button}
                  />
                </ListItem>
              </List>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Logo />
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <IconButton className={classes.signOutButton} color="inherit">
              <Link to="/logout">
                <InputIcon />
              </Link>
            </IconButton>
            <Drawer
              classes={{
                paper: classes.drawer
              }}
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
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default SideAndTopNavBar;
