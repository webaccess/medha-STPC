import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Typography } from "../../../components";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import useStyles from "./DisplayCollegeDetailsStyle";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";

const CollegeName = "College name";
const CollegeCode = "College code";
const CollegeAddress = "College address";
const District = "District";
const State = "State";
const RPCName = "RPC";
const Zone = "Zone";
const ContactNumber = "Contact";
const Email = "Email-Id";
const Principal = "Principal";
const Streams = "Stream";
const Strength = "Strength";
const StreamNotPresent = "Stream and data not present";
const DisplayCollegeDetails = props => {
  const history = useHistory();
  const classes = useStyles();
  const COLLEGE_URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
  const ZONE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
  const [formState, setFormState] = useState({
    collegeDetails: [],
    streams: []
  });
  useEffect(() => {
    getCollegeData();
  }, []);

  async function getCollegeData() {
    let paramsForCollege;
    if (auth.getUserInfo().role.name === "College Admin") {
      paramsForCollege = {
        id: auth.getUserInfo().college.id
      };
    } else if (auth.getUserInfo().role.name === "Medha Admin") {
      paramsForCollege = {
        id: props["location"]["dataForEdit"]
      };
    }
    if (paramsForCollege.id !== undefined) {
      await serviceProviders
        .serviceProviderForGetRequest(COLLEGE_URL, paramsForCollege)
        .then(res => {
          let viewData = res.data.result[0];
          setFormState(formState => ({
            ...formState,
            collegeDetails: viewData
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
  }

  const editData = () => {
    history.push({
      pathname: routeConstants.EDIT_COLLEGE,
      editCollege: true,
      dataForEdit: formState.collegeDetails
    });
  };

  return (
    <Grid className={classes.root}>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          View College
        </Typography>
      </Grid>
      <Grid spacing={3}>
        {formState.collegeDetails ? (
          <form>
            <Card>
              <Grid item xs={12} md={6} xl={3}>
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {CollegeName}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {CollegeCode}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.college_code}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {CollegeAddress}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.address}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {State}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.state &&
                              formState.collegeDetails.state.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {District}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.district &&
                              formState.collegeDetails.district.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {Zone}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.zone &&
                              formState.collegeDetails.zone.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {RPCName}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.rpc &&
                              formState.collegeDetails.rpc.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {ContactNumber}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.contact_number}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {Email}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.college_email}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.CellHeader}>
                            {Principal}
                          </TableCell>
                          <TableCell className={classes.CellValue}>
                            {formState.collegeDetails.principal &&
                              formState.collegeDetails.principal.username}
                          </TableCell>
                        </TableRow>
                        {formState.collegeDetails.stream_strength ? (
                          <div>
                            <TableRow>
                              <TableCell className={classes.CellHeader}>
                                Stream And Strength
                              </TableCell>
                              <TableCell
                                className={classes.CellValue}
                              ></TableCell>
                            </TableRow>
                            {formState.collegeDetails.stream_strength.map(
                              value => (
                                <TableRow>
                                  <TableCell className={classes.CellHeader}>
                                    {value.stream.name}
                                  </TableCell>
                                  <TableCell className={classes.CellValue}>
                                    {value.strength}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </div>
                        ) : (
                          <p>{StreamNotPresent}</p>
                        )}
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
                    {genericConstants.EDIT_TEXT}
                  </YellowButton>
                  {auth.getUserInfo().role.name !== "College Admin" ? (
                    <GrayButton
                      color="primary"
                      variant="contained"
                      to={routeConstants.VIEW_COLLEGE}
                      className={classes.resetbtn}
                    >
                      {genericConstants.CANCEL_BUTTON_TEXT}
                    </GrayButton>
                  ) : null}
                </CardActions>
              </Grid>
            </Card>
          </form>
        ) : null}
      </Grid>
    </Grid>
  );
};
export default DisplayCollegeDetails;
