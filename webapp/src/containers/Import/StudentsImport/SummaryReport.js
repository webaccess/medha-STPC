import React, { useState, useContext } from "react";
import { Card, CardContent, Grid, Typography, Link } from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import XLSX from "xlsx";

const SummaryReport = props => {
  const classes = useStyles();
  const { data } = props.location;

  let totalRecords, importedRecords, errorRecords;
  if (data) {
    totalRecords = data.total;
    importedRecords = data.success;
    errorRecords = data.error;
  }

  const handleClickDownload = () => {
    let wb = XLSX.utils.book_new();

    if (data) {
      const headers = [
        "Name",
        "Gender",
        "DOB",
        "Contact Number",
        "Alternate Contact",
        "Stream",
        "Address",
        "State",
        "District",
        "Email",
        "Qualification",
        "Stream",
        "Error"
      ];
      let workSheetName = "Users";
      let ws = XLSX.utils.json_to_sheet(data.records, ...headers);
      wb.SheetNames.push(workSheetName);
      wb.Sheets[workSheetName] = ws;

      XLSX.writeFile(wb, "students.csv", { bookType: "csv" });
    }
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.STUDENT_IMPORT_SUMMARY}
        </Typography>
      </Grid>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              CSV records
            </Grid>
            <Grid item xs={6}>
              {totalRecords || "-"}
            </Grid>
            <Grid item xs={6}>
              Imported Records
            </Grid>
            <Grid item xs={6}>
              {importedRecords || "-"}
            </Grid>
            <Grid item xs={6}>
              Error(s)
            </Grid>
            <Grid item xs={6} className={classes.DisplayFlex}>
              <div style={{ alignSelf: "center" }}>{errorRecords || "-"}</div>
              {errorRecords ? (
                <div className={classes.filterButtonsMargin}>
                  <Link component="button" onClick={handleClickDownload}>
                    (Click to download)
                  </Link>
                </div>
              ) : null}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default SummaryReport;
