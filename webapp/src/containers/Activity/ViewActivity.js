import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import * as routeConstants from "../../constants/RouteConstants.js";
import { useHistory } from "react-router-dom";
import YellowButton from "../../components/YellowButton/YellowButton.js";
import * as genericConstants from "../../constants/GenericConstants.js";
const ViewActivity = props => {
  const history = useHistory();
  return (
    <div>
      IN View Activity
      <YellowButton
        type="submit"
        color="primary"
        variant="contained"
        onClick={() => {
          history.push(routeConstants.CREATE_ACTIVITY);
        }}
      >
        {genericConstants.ADD_ACTIVITY}
      </YellowButton>
      <YellowButton></YellowButton>
    </div>
  );
};
export default ViewActivity;
