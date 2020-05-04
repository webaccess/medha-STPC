import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  Typography,
  FormHelperText,
  Button
} from "@material-ui/core";
import CSVReader from "react-csv-reader";

import * as genericConstants from "../../../constants/GenericConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";

const StudentsImport = props => {
  const classes = useStyles();

  const handleForce = (data, fileInfo) => console.log(data, fileInfo);

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.ADD_EVENT_TEXT}
        </Typography>
      </Grid>
      <Card>
        <CardContent>
          <Grid>
            {" "}
            <p>
              Create a CSV file using any standard spread sheet application. For
              each user account, create a new row (line) and enter data into
              each column (field). Each row equal one record.
            </p>
            <p>
              Please <a href="#">download</a> a simple CSV file for the
              reference.
            </p>
          </Grid>
          <Grid container>
            <div className={classes.container}>
              <CSVReader
                cssClass={classes.csvInput}
                label="Upload CSV"
                onFileLoaded={handleForce}
                parserOptions={papaparseOptions}
              />
            </div>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default StudentsImport;
