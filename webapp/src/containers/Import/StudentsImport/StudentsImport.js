import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
//import CSVReader from "react-csv-reader";
import { CSVReader } from "react-papaparse";
import PublishIcon from "@material-ui/icons/Publish";
import CloudUpload from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";

import * as genericConstants from "../../../constants/GenericConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import * as serviceProviders from "../../../api/Axios";
import { useHistory } from "react-router-dom";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Alert } from "../../../components";
import ImportStudentsModal from "./PreviewAndImport";
import LoaderContext from "../../../context/LoaderContext";

const StudentsImport = props => {
  const classes = useStyles();
  const history = useHistory();
  const { setLoaderStatus } = useContext(LoaderContext);
  const [files, setFiles] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: ""
  });
  const [showPreviewAndImportModal, setShowPreviewAndImportModal] = useState(
    false
  );
  const [fileData, setFileData] = useState(null);
  const [preview, setPreview] = useState(false);
  const URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENT_IMPORT_CSV;
  // const handleForce = (data, fileInfo) => console.log(data, fileInfo);

  // const papaparseOptions = {
  //   header: true,
  //   dynamicTyping: true,
  //   skipEmptyLines: true,
  //   transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
  // };

  const handleOnDrop = (data, file) => {
    setFiles(file);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = data => {
    setFiles(null);
    setPreview(false);
    setFileData(null);
  };

  const postUploadData = async () => {
    let postData = databaseUtilities.uploadStudentCSV(files);

    serviceProviders
      .serviceProviderForPostRequest(URL, postData)
      .then(res => {
        setAlert(() => ({
          isOpen: true,
          message: "File uploaded successfully",
          severity: "success"
        }));
        setPreview(true);
        setFileData(res.data);
      })
      .catch(error => {
        setAlert(() => ({
          isOpen: true,
          message: "Something went wrong while uploading file",
          severity: "error"
        }));
        setPreview(false);
        setFileData(null);
      });
  };

  const handlePreviewClick = () => {
    setShowPreviewAndImportModal(true);
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.STUDENTS_IMPORT}
        </Typography>
      </Grid>
      {alert.isOpen ? (
        <Alert
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(() => ({ isOpen: false }));
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      ) : null}
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
              startIcon={<CloudUpload />}
              disabled={files ? false : true}
              onClick={postUploadData}
            >
              UPLOAD FILE
            </Button>
          </Grid>
          <Grid item style={{ marginTop: "16px" }}>
            <Button
              variant="contained"
              color="primary"
              component="span"
              fullWidth
              className={classes.InputFileButton}
              disabled={!preview}
              onClick={handlePreviewClick}
            >
              PREVIEW
            </Button>
          </Grid>
        </CardContent>
      </Card>
      {showPreviewAndImportModal ? (
        <ImportStudentsModal
          showModal={showPreviewAndImportModal}
          closeModal={() => setShowPreviewAndImportModal(false)}
          id={fileData.id}
          loading={val => setLoaderStatus(val)}
          clear={handleOnRemoveFile}
          alert={(isOpen, severity, message) =>
            setAlert({
              severity,
              message,
              isOpen
            })
          }
        />
      ) : null}
    </Grid>
  );
};
export default StudentsImport;
