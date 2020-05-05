import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@material-ui/core";
//import CSVReader from "react-csv-reader";
import { CSVReader } from "react-papaparse";
import PublishIcon from "@material-ui/icons/Publish";

import * as genericConstants from "../../../constants/GenericConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";

const StudentsImport = props => {
  const classes = useStyles();

  // const handleForce = (data, fileInfo) => console.log(data, fileInfo);

  // const papaparseOptions = {
  //   header: true,
  //   dynamicTyping: true,
  //   skipEmptyLines: true,
  //   transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
  // };

  const handleOnDrop = data => {
    console.log("---------------------------");
    console.log(data);
    console.log("---------------------------");
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = data => {
    console.log("---------------------------");
    console.log(data);
    console.log("---------------------------");
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.STUDENTS_IMPORT}
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
              Please <a href="/files/sample.csv">download</a> a simple CSV file
              for the reference.
            </p>
          </Grid>
          <Grid>
            <div className={classes.container}>
              {/* <CSVReader
                cssInputClass={classes.csvInput}
                label="Upload CSV"
                onFileLoaded={handleForce}
                parserOptions={papaparseOptions}
              /> */}
              <CSVReader
                onDrop={handleOnDrop}
                onError={handleOnError}
                addRemoveButton
                onRemoveFile={handleOnRemoveFile}
              >
                <span>Drop CSV file here or click to upload.</span>
              </CSVReader>
            </div>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component="span"
              fullWidth
              className={classes.InputFileButton}
              startIcon={<PublishIcon />}
            >
              IMPORT STUDENTS
            </Button>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default StudentsImport;
