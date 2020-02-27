import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";

import * as strapiConstants from "../../constants/StrapiApiConstants";
import Spinner from "../../components/Spinner/Spinner";

import Autocomplete from "@material-ui/lab/Autocomplete";
import Table from "../../components/Table/Table.js";
import styles from "./Zone.module.css";
import useStyles from "./ZoneStyles";

const ViewZone = props => {
  const [formState, setFormState] = useState({
    data: [],
    viewzones: [],
    isShowing: false,
    DeleteIsShowing: false,
    selectedid: [],
    getstates: [],
    editstate: [],
    editzone: [],
    filterData: {}
  });

  useEffect(() => {
    getZoneData();
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          getstates: res.data
        }));
      });
  }, []);

  const getZoneData = () => {
    axios({
      method: "get",
      url: strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES,
      params: { name: formState.filterData["name"] }
    }).then(res => {
      setFormState(formState => ({
        ...formState,
        viewzones: res.data
      }));
    });
  };

  const restoreData = () => {
    axios({
      method: "get",
      url: strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES,
      params: {}
    }).then(res => {
      setFormState(formState => ({
        ...formState,
        viewzones: res.data
      }));
    });
  };

  const editCell = event => {
    console.log("Edit ", event.target.id);
  };

  const deleteCell = event => {
    console.log("Delete ", event.target.id);
  };

  const handleChange = (event, value) => {
    formState.filterData = value;
    {
      console.log(
        "FilterData",
        formState.filterData,
        formState.data,
        formState.viewzones
      );
    }
  };

  const searchFilter = () => {
    formState.data = [];
    formState.viewzones = [];
    getZoneData();
    {
      console.log(
        "searchFilter",
        formState.filterData,
        formState.data,
        formState.viewzones
      );
    }
  };

  const clearFilter = () => {
    formState.filterData = {};
    formState.data = [];
    formState.viewzones = [];
    restoreData();
  };

  const column = [
    { name: "Id", sortable: true, selector: "id" },
    { name: "Zone", sortable: true, selector: "name" },
    { name: "States", sortable: true, selector: "state" },
    {
      cell: cell => (
        <i
          className="material-icons"
          id={cell.id}
          value={cell.name}
          onClick={editCell}
        >
          edit
        </i>
      ),
      button: true,
      conditionalCellStyles: []
    },
    {
      cell: cell => (
        <i className="material-icons" id={cell.id} onClick={deleteCell}>
          delete_outline
        </i>
      ),
      button: true,
      conditionalCellStyles: []
    }
  ];

  /** Initialize the data to sent */
  formState.data = [];

  /** Set zone data to data in formState */
  if (formState.viewzones.length) {
    for (let i in formState.viewzones) {
      var temp = {};
      temp["id"] = formState.viewzones[i]["id"];
      temp["name"] = formState.viewzones[i]["name"];
      temp["state"] = formState.viewzones[i]["state"]["name"];
      formState.data.push(temp);
    }
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item>
          <Typography variant="h1" className={styles.header}>
            Manage Zone
          </Typography>
        </Grid>
        <Card className={styles.filterButton}>
          <CardContent>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  options={formState.data}
                  getOptionLabel={option => option.name}
                  onChange={handleChange}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Zone Name"
                      variant="outlined"
                      style={{ width: "auto" }}
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={searchFilter}
                >
                  Search
                </Button>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={clearFilter}
                  disableElevation
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {formState.data.length ? (
          <Table
            filterData={true}
            filterBy={["state", "name"]}
            data={formState.data}
            column={column}
            editEvent={editCell}
            deleteEvent={deleteCell}
          />
        ) : (
          <Spinner />
        )}
      </Grid>
    </div>
  );
};

export default ViewZone;
