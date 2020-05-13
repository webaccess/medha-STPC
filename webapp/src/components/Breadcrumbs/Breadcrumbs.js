import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Chip from "@material-ui/core/Chip";
import { emphasize, withStyles, makeStyles } from "@material-ui/core/styles";

const StyledBreadcrumb = withStyles(theme => ({
  root: {
    backgroundColor: "#666666",
    height: theme.spacing(3),
    color: "white",
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: "#f6c80a"
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize("#666666", 0.12)
    }
  }
}))(Chip);

const styles = makeStyles(() => ({
  root: {
    paddingTop: "8px"
  }
}));

const ActiveLastBreadcrumbs = props => {
  const classes = styles();
  let history = useHistory();
  const handleClick = url => {
    history.push({
      pathname: url
    });
  };

  const size = props.list.length - 1;
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
      className={classes.root}
    >
      {props.list.map((item, index) => {
        return index !== size ? (
          <StyledBreadcrumb
            onClick={() => handleClick(item.href)}
            label={item.title}
          />
        ) : (
          <Typography color="textPrimary">{item.title}</Typography>
        );
      })}
    </Breadcrumbs>
  );
};

ActiveLastBreadcrumbs.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      href: PropTypes.string
    })
  )
};

export default ActiveLastBreadcrumbs;
