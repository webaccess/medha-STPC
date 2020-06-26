import React from "react";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import useStyles from "./ImportStyles";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Table, YellowButton } from "../../../components";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const PreviewAndImport = props => {
  const classes = useStyles();
  const handleStudentImport = () => {
    const { id } = props.data;
    props.updateStatus(id);
    props.closeModal();
    props.clear();
    const IMPORT_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_STUDENT_IMPORT_CSV +
      `/${id}/import`;

    serviceProviders
      .serviceProviderForPostRequest(IMPORT_URL)
      .then(() => {})
      .catch(error => {
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
      name: "Email",
      selector: "Email"
    },
    {
      name: "Qualification",
      selector: "Qualification"
    },
    {
      name: "Year",
      selector: "Year"
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
                    data={props.data.tableData}
                    column={columns}
                    defaultSortField="name"
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
