import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const ActiveLastBreadcrumbs = props => {
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
    >
      {props.list.map((item, index) => {
        return index !== size ? (
          <Link onClick={() => handleClick(item.href)}>{item.title}</Link>
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
