import React, { Component } from "react";
import Layout from "../../hoc/Layout/Layout";
import useStyles from "./Styles";
import clsx from "clsx";

import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  TextField
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
const Dashboard = props => {
  const { container, className, ...rest } = props;
  const classes = useStyles();
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  function createDatazone(zonename: string, zoneresult: number) {
    return { zonename, zoneresult };
  }

  function createDataind(industry: string, industryresult: number) {
    return { industry, industryresult };
  }

  function createDataplacement(placement: string, placementresult: number) {
    return { placement, placementresult };
  }

  const zonerows = [
    createDatazone("Overall Workshops", 25),
    createDatazone("1st Year", 40),
    createDatazone("2nd Year", 45),
    createDatazone("Final Year", 42),
    createDatazone("Entrepreneurship", 2),
    createDatazone("1st Year Attendance", 38),
    createDatazone("2nd Year Attendance", 42),
    createDatazone("Final Year Attendanc", 42),
    createDatazone("Planned Vs Achieved", 6),
    createDatazone("Unique Students", 6),
    createDatazone("Instittions touched", 5),
    createDatazone("Student Feedback", 22),
    createDatazone("Stream", "IT"),
    createDatazone("TPO Feedback", 2)
  ];

  const indrows = [
    createDataind("Industrial Visit", 3),
    createDataind("Overall Industrial Visit", 3),
    createDataind("Attendance", 40),
    createDataind("Planned Vs Achieved", 45),
    createDataind("Instittions touched", 42),
    createDataind("Student Feedback", 2),
    createDataind("TPO Feedback", 38),
    createDataind("Employer Feedback", 42),
    createDataind("Stream", 42)
  ];

  const placementrows = [
    createDataplacement("Placement", 5),
    createDataplacement("Stream", "IT"),
    createDataplacement("OFFERS", 40),
    createDataplacement("JOINED", 38),
    createDataplacement("RETENNTION", 3),
    createDataplacement("Student Feedback", 20),
    createDataplacement("TPO Feedback", 18),
    createDataplacement("Employer Feedback", 18),
    createDataplacement("College Feedback", 42)
  ];

  const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
      head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
      },
      body: {
        fontSize: 14
      }
    })
  )(TableCell);

  const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
      root: {
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.background.default
        }
      }
    })
  )(TableRow);

  return (
    <Layout>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item lg={2} sm={6} xl={3} xs={12}>
            <Card {...rest} className={clsx(classes.root, className)}>
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Workshops
                    </Typography>
                    <Typography variant="h1">25</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={2} sm={6} xl={3} xs={12}>
            <Card {...rest} className={clsx(classes.root, className)}>
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      TPO Feedback
                    </Typography>
                    <Typography variant="h1">20</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={2} sm={6} xl={3} xs={12}>
            <Card {...rest} className={clsx(classes.root, className)}>
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Student Feedback
                    </Typography>
                    <Typography variant="h1">22</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={2} sm={6} xl={3} xs={12}>
            <Card {...rest} className={clsx(classes.root, className)}>
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Industrial Visits
                    </Typography>
                    <Typography variant="h1">3</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={2} sm={6} xl={3} xs={12}>
            <Card {...rest} className={clsx(classes.root, className)}>
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Interships
                    </Typography>
                    <Typography variant="h1">2</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={2} md={6} xl={3} xs={12}>
            <Card {...rest} className={clsx(classes.root, className)}>
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Placement
                    </Typography>
                    <Typography variant="h1">5</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={12} md={6} xl={9} xs={12}>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={2} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel ref={inputLabel} id="select-Zone">
                        Select Zone
                      </InputLabel>
                      <Autocomplete
                        id={"demo"}
                        options={[]}
                        getOptionLabel={option => option.name}
                        /* This is used to set the default value to the auto complete */
                        name={"demo-id"}
                        renderInput={params => (
                          <TextField
                            {...params}
                            placeholder={"Select Zone"}
                            value={option => option.id}
                            name={"demo"}
                            key={option => option.id}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel ref={inputLabel} id="select-region">
                        Select Region
                      </InputLabel>
                      <Autocomplete
                        id={"demo"}
                        options={[]}
                        getOptionLabel={option => option.name}
                        /* This is used to set the default value to the auto complete */
                        name={"demo-id"}
                        renderInput={params => (
                          <TextField
                            {...params}
                            placeholder={"Select Region"}
                            value={option => option.id}
                            name={"demo"}
                            key={option => option.id}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel ref={inputLabel} id="select-college">
                        Select College
                      </InputLabel>
                      <Autocomplete
                        id={"demo"}
                        options={[]}
                        getOptionLabel={option => option.name}
                        /* This is used to set the default value to the auto complete */
                        name={"demo-id"}
                        renderInput={params => (
                          <TextField
                            {...params}
                            placeholder={"Select College"}
                            value={option => option.id}
                            name={"demo"}
                            key={option => option.id}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel ref={inputLabel} id="select-month">
                        Select Month
                      </InputLabel>
                      <Autocomplete
                        id={"demo"}
                        options={[]}
                        getOptionLabel={option => option.name}
                        /* This is used to set the default value to the auto complete */
                        name={"demo-id"}
                        renderInput={params => (
                          <TextField
                            {...params}
                            placeholder={"Select Month"}
                            value={option => option.id}
                            name={"demo"}
                            key={option => option.id}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel ref={inputLabel} id="select-trainer">
                        Select Trainer
                      </InputLabel>
                      <Autocomplete
                        id={"demo"}
                        options={[]}
                        getOptionLabel={option => option.name}
                        /* This is used to set the default value to the auto complete */
                        name={"demo-id"}
                        renderInput={params => (
                          <TextField
                            {...params}
                            placeholder={"Select Trainer"}
                            value={option => option.id}
                            name={"demo"}
                            key={option => option.id}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Grid item md={4} xs={12}>
                  <Grid item xs={12} className={classes.title}>
                    <Typography variant="h4" gutterBottom>
                      Result:- Zone / Region / College / Month
                    </Typography>
                  </Grid>
                  <TableContainer component={Paper}>
                    <Table
                      className={classes.table}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Zone</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {zonerows.map(zonerow => (
                          <StyledTableRow key={zonerow.zonename}>
                            <StyledTableCell component="th" scope="zonerow">
                              {zonerow.zonename}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {zonerow.zoneresult}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Grid item md={4} xs={12}>
                  <Grid item xs={12} className={classes.title}>
                    <Typography variant="h4" gutterBottom>
                      Result:- Industrial Visit
                    </Typography>
                  </Grid>
                  <TableContainer component={Paper}>
                    <Table
                      className={classes.table}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Industrial Visit</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {indrows.map(indrow => (
                          <StyledTableRow key={indrow.industry}>
                            <StyledTableCell component="th" scope="indrow">
                              {indrow.industry}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {indrow.industryresult}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Grid item md={4} xs={12}>
                  <Grid item xs={12} className={classes.title}>
                    <Typography variant="h4" gutterBottom>
                      Result:- Placement
                    </Typography>
                  </Grid>
                  <TableContainer component={Paper}>
                    <Table
                      className={classes.table}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Placement</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {placementrows.map(placementrow => (
                          <StyledTableRow key={placementrow.placement}>
                            <StyledTableCell
                              component="th"
                              scope="placementrow"
                            >
                              {placementrow.placement}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {placementrow.placementresult}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};
export default Dashboard;
