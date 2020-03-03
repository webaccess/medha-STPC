import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import { CustomRouterLink } from "../../../components";
import useStyles from "./ViewUserStyles"
import styles from "../User.module.css";




const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;

const ViewUsers = () => {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item>
          <Typography variant="h1" className={styles.header}>
            Manage User
          </Typography>
        </Grid>
        <Grid item sm>
          <Button
            variant="contained"
            color="primary"
            //onClick={clearFilter}
            disableElevation
            className={classes.addUserButton}
            component={CustomRouterLink}
            to={routeConstants.ADD_USER}
          >
            Add User
          </Button>
        </Grid>
        {/* This is used for the filterig data */}
        <Card className={styles.filterButton}>
          <CardContent>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                 // options={formState.states}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Name"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
                
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                 // options={formState.states}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Role"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
                
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                 // options={formState.states}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Zone"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
                
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                 // options={formState.states}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="RPC"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
                
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                 // options={formState.states}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="IPC"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
                
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                 //onClick={searchFilter}
                >
                  Search
                </Button>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  //onClick={clearFilter}
                  disableElevation
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* {formState.dataToShow ? (
          formState.dataToShow.length ? (
            <Table
            
              data={formState.dataToShow}
              column={column}
              editEvent={editCell}
              

              //deleteEvent={deleteCell}
            />
          ) : (
            <Spinner />
          )
        ) : (
          <div className={classes.noDataMargin}>No data to show</div>
        )} */}
        {/* <EditState
          showModal={formState.showEditModal}
          closeModal={handleCloseModal}
          dataToEdit={formState.dataToEdit}
          id={formState.dataToEdit["id"]}
          editEvent={isEditCellCompleted}
        />
        <DeleteState
          showModal={formState.showModalDelete}
          closeModal={handleCloseDeleteModal}
          id={formState.dataToDelete["id"]}
          deleteEvent={isDeleteCellCompleted}
        /> */}
      </Grid>
    </div>
  );


};

export default ViewUsers;