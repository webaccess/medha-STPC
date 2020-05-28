import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";

import useStyles from "./ImportStyles";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import { Table, YellowButton } from "../../../components";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import XLSX from "xlsx";

const PreviewAndImport = props => {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    previewData();
  }, ["props.id"]);

  const previewData = () => {
    const { id } = props;
    const PREVIEW =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_STUDENT_IMPORT_CSV +
      `/${id}/preview`;

    serviceProviders
      .serviceProviderForGetRequest(PREVIEW)
      .then(({ data }) => {
        setData(data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleStudentImport = () => {
    props.loading(true);
    const { id } = props;
    const IMPORT_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_STUDENT_IMPORT_CSV +
      `/${id}/import`;

    serviceProviders
      .serviceProviderForGetRequest(IMPORT_URL)
      .then(({ data }) => {
        props.loading(false);
        props.closeModal();
        props.clear();
        if (data.length) {
          props.alert(
            true,
            "warning",
            "Not all students where imported...please check downloaded file for more info"
          );
          let wb = XLSX.utils.book_new();

          /**
           * Create worksheet for every batch
           * Add students list for respective batch
           */
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
          let ws = XLSX.utils.json_to_sheet(data, ...headers);
          wb.SheetNames.push(workSheetName);
          wb.Sheets[workSheetName] = ws;

          XLSX.writeFile(wb, "students.csv", { bookType: "csv" });
        } else {
          props.alert(true, "success", "Student import was successfull");
        }
      })
      .catch(error => {
        props.loading(false);
        props.closeModal();
        props.clear();
        props.alert(
          true,
          "error",
          "Something went wrong while student importing"
        );
        console.log(error);
      });
  };

  const columns = [
    {
      name: "Name",
      selector: "Name"
    },
    {
      name: "Gender",
      selector: "Gender"
    },
    {
      name: "DOB",
      selector: "DOB"
    },
    {
      name: "Contact Number",
      selector: "Contact Number"
    },
    {
      name: "Alternate Contact",
      selector: "Alternate Contact"
    },
    {
      name: "Stream",
      selector: "Stream"
    },
    {
      name: "Address",
      selector: "Address"
    },
    {
      name: "State",
      selector: "State"
    },
    {
      name: "District",
      selector: "District"
    },
    {
      name: "Email",
      selector: "Email"
    },
    {
      name: "Qualification",
      selector: "Qualification"
    },
    {
      name: "Stream",
      selector: "Stream"
    }
  ];
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      onClose={() => props.closeModal()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <Typography variant={"h2"} className={classes.textMargin}>
            PREVIEW STUDENTS
          </Typography>
          <div className={classes.editDialogue}>
            <Grid item xs={12}>
              <Grid>
                <Grid item xs={12} className={classes.formgrid}>
                  <Table
                    data={data}
                    column={columns}
                    defaultSortField="name"
                    progressPending={isLoading}
                    noDataComponent="No Student Details to preview"
                    pagination={false}
                    selectableRows={false}
                  />
                  <Card
                    className={{
                      borderRadius: "0px !important;",
                      boxShadow: "none !important;"
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item className={classes.filterButtonsMargin}>
                          <YellowButton
                            type="submit"
                            color="primary"
                            variant="contained"
                            onClick={handleStudentImport}
                          >
                            IMPORT STUDENTS
                          </YellowButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default PreviewAndImport;
