import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Typography } from "../../../components";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  TextField
} from "@material-ui/core";
import useStyles from "../DisplayUserDetailsStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";
import { typography } from "@material-ui/system";

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;

const DisplayUserDetails = props => {
  const classes = useStyles();
  const history = useHistory();

  const [formState, setFormState] = useState({
    userDetails: []
  });
  console.log("userdetails", formState.userDetails);
  useEffect(() => {
    getUserData();
  }, []);

  console.log("fetched", props["location"]["dataForEdit"]);
  const getUserData = async () => {
    let paramsForUser;

    if (auth.getUserInfo().role.name === "Medha Admin") {
      paramsForUser = {
        id: props["location"]["dataForEdit"]
      };
    }
    if (paramsForUser.id !== undefined) {
      await serviceProviders
        .serviceProviderForGetRequest(USER_URL, paramsForUser)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            userDetails: res.data.result[0]
          }));
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      history.push({
        pathname: routeConstants.VIEW_COLLEGE
      });
    }
  };

  const editData = () => {
    history.push({
      pathname: routeConstants.EDIT_USER,
      editCollege: true,
      dataForEdit: formState.userDetails
    });
  };

  const handleOnChange = event => {
    console.log("Click");
    console.log(event.target.value);
  };

  return (
    <Grid className={classes.root}>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          View User
        </Typography>
      </Grid>
      <Grid spacing={3}>
        <Card>
          <Grid item xs={12} md={6} xl={3}>
            <CardContent>
              <TextField
                id="firstname"
                label="First Name"
                disabled
                defaultValue={formState.userDetails.first_name}
                multiline
                margin="normal"
                variant="outlined"
                onChange={handleOnChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </CardContent>
            <CardContent>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>
                        First Name
                      </TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.first_name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>
                        Last Name
                      </TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.last_name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>
                        User Name
                      </TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.username}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>
                        Email
                      </TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.email}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>
                        Contact
                      </TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.contact_number}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>Role</TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.role &&
                          formState.userDetails.role.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>
                        State
                      </TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.state &&
                          formState.userDetails.state.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>Zone</TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.zone &&
                          formState.userDetails.zone.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>RPC</TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.rpc &&
                          formState.userDetails.rpc.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.CellHeader}>
                        College
                      </TableCell>
                      <TableCell className={classes.CellValue}>
                        {formState.userDetails.college &&
                          formState.userDetails.college.name}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Grid>
          <Grid item xs={12} className={classes.CardActionGrid}>
            <CardActions className={classes.btnspace}>
              <YellowButton
                type="submit"
                color="primary"
                variant="contained"
                onClick={editData}
                className={classes.submitbtn}
              >
                Edit
              </YellowButton>
              <GrayButton
                color="primary"
                variant="contained"
                to={routeConstants.VIEW_USER}
                className={classes.resetbtn}
              >
                Cancel
              </GrayButton>
            </CardActions>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
export default DisplayUserDetails;
