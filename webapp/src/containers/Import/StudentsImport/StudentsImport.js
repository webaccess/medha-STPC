import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
import { CSVReader } from "react-papaparse";
import CloudUpload from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";
import * as genericConstants from "../../../constants/GenericConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as XLSX from "xlsx";
import {
  Alert,
  Auth,
  Table,
  RetryIcon,
  DownloadIcon,
  LinearProgressWithLabel,
  DeleteGridIcon
} from "../../../components";
import ImportStudentsModal from "./PreviewAndImport";
import LoaderContext from "../../../context/LoaderContext";
import { Link } from "react-router-dom";
import auth from "../../../components/Auth";

const StudentsImport = props => {
  const classes = useStyles();
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
  const [importHistory, setImportHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENT_IMPORT_CSV;

  const contact = Auth.getUserInfo() ? Auth.getUserInfo().contact : null;

  useEffect(() => {
    getImportHistory();
  }, []);

  useEffect(() => {
    let id;
    if (showProgress && fileId) {
      id = setInterval(() => {
        fetchFileDetails();
      }, 5000);
      setIntervalId(id);
    }
    return () => clearInterval(id);
  }, [showProgress, fileId]);

  const getImportHistory = () => {
    setLoading(true);
    const url = URL + "/get-files-details";
    serviceProviders
      .serviceProviderForGetRequest(url)
      .then(({ data }) => {
        setLoading(false);
        setImportHistory(data.result);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleOnDrop = (data, file) => {
    setFiles(file);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = data => {
    setFiles(null);
    setFileData(null);
  };

  const postUploadData = async () => {
    let postData = databaseUtilities.uploadStudentCSV(files, contact);
    setLoaderStatus(true);
    serviceProviders
      .serviceProviderForPostRequest(URL, postData)
      .then(res => {
        setAlert(() => ({
          isOpen: true,
          message: "File uploaded successfully",
          severity: "success"
        }));
        setFileData(res.data);
        setShowPreviewAndImportModal(true);
        setLoaderStatus(false);
      })
      .catch(error => {
        setAlert(() => ({
          isOpen: true,
          message: "Something went wrong while uploading file",
          severity: "error"
        }));
        setFileData(null);
        setLoaderStatus(false);
      });
  };

  const updateStatus = id => {
    setShowProgress(true);
    setFileId(id);
  };

  const fetchFileDetails = () => {
    if (showProgress) {
      const url = URL + `/${fileId}/get-imported-file-status`;
      serviceProviders
        .serviceProviderForGetAsyncRequest(url)
        .then(({ data }) => {
          const val = (data.pending / data.total) * 100;
          const progress = 100 - val == 0 ? 0 : 100 - val;
          if (progress == 100) {
            clearInterval(intervalId);
            setFileId(null);
            setShowProgress(false);
            setProgress(0);
            setAlert(() => ({
              isOpen: true,
              message: `File processed successfully`,
              severity: "success"
            }));
            getImportHistory();
          } else {
            setProgress(progress);
          }
        })
        .catch(() => {
          clearInterval(intervalId);
          setFileId(null);
          setShowProgress(false);
          setProgress(0);
        });
    }
  };

  const retry = (id, name) => {
    const IMPORT_URL = URL + `/${id}/import?retry=true`;
    updateStatus(id);
    serviceProviders
      .serviceProviderForPostRequest(IMPORT_URL)
      .then(() => {
        getImportHistory();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const downloadErrorFile = (id, name) => {
    const url = URL + `/${id}/get-file-records?status=error`;
    setLoaderStatus(true);
    serviceProviders
      .serviceProviderForGetRequest(url)
      .then(({ data }) => {
        setLoaderStatus(false);
        if (data.result) {
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
            let ws = XLSX.utils.json_to_sheet(data.result, ...headers);
            wb.SheetNames.push(workSheetName);
            wb.Sheets[workSheetName] = ws;

            XLSX.writeFile(wb, "students.csv", { bookType: "csv" });
          }
        }
      })
      .catch(error => {
        setLoaderStatus(false);
      });
  };

  const deleteFile = id => {
    const URL =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENT_IMPORT_CSV;
    setLoaderStatus(true);
    serviceProviders
      .serviceProviderForDeleteRequest(URL, id)
      .then(() => {
        setLoaderStatus(false);
        setAlert(() => ({
          isOpen: true,
          message: "Record deleted successfully",
          severity: "success"
        }));
        getImportHistory();
      })
      .catch(error => {
        console.log(error);
        setLoaderStatus(false);
        setAlert(() => ({
          isOpen: true,
          message: "Something went wrong while deleting record",
          severity: "error"
        }));
      });
  };

  const downloadSampleCsv = async () => {
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
      "Qualification"
    ];
    let finalArray = [];
    if (
      auth.getUserInfo().studentInfo.organization.stream_strength.length !== 0
    ) {
      auth
        .getUserInfo()
        .studentInfo.organization.stream_strength.map(stream => {
          let json = {
            Name: "test" + stream.id + " test" + stream.id,
            Gender: "Male",
            DOB: "01-01-2000",
            "Contact Number":
              Math.floor(1000000000 + Math.random() * 1000000000) + stream.id,
            "Alternate Contact": "",
            Stream: stream["stream"].name,
            Address: "address_" + stream.id,
            State: "Uttar Pradesh",
            District: "Agra",
            Email: "test" + stream.id + "@test.com",
            Qualification: "undergraduate",
            Year: "First"
          };
          finalArray.push(json);
        });
    } else {
      let json = {
        Name: "",
        Gender: "",
        DOB: "",
        "Contact Number": "",
        "Alternate Contact": "",
        Stream: "",
        Address: "",
        State: "",
        District: "",
        Email: "",
        Qualification: "",
        Year: ""
      };
      finalArray.push(json);
    }
    let wb = XLSX.utils.book_new();
    let workSheetName = "sample";
    let ws = XLSX.utils.json_to_sheet(finalArray, ...headers);
    wb.SheetNames.push(workSheetName);
    wb.Sheets[workSheetName] = ws;
    XLSX.writeFile(wb, "sample.csv", { bookType: "csv" });

    setLoaderStatus(false);
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", selector: "imported_file.name" },
    { name: "Total Records", selector: "total" },
    { name: "Pending", selector: "pending" },
    { name: "Error", selector: "error" },
    { name: "Success", selector: "success" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <>
            <div className={classes.PaddingFirstActionButton}>
              <DeleteGridIcon
                id={cell.id}
                value={cell.imported_file.name}
                onClick={() => deleteFile(cell.id)}
              />
            </div>
            {cell.pending != 0 ? (
              <div className={classes.PaddingActionButton}>
                <RetryIcon
                  id={cell.id}
                  value={cell.imported_file.name}
                  onClick={() => retry(cell.id, cell.imported_file.name)}
                />
              </div>
            ) : null}
            {cell.error != 0 ? (
              <div className={classes.PaddingActionButton}>
                <DownloadIcon
                  id={cell.id}
                  value={cell.imported_file.name}
                  title="Download error file"
                  onClick={() =>
                    downloadErrorFile(cell.id, cell.imported_file.name)
                  }
                />
              </div>
            ) : null}
          </>
        </div>
      ),
      width: "18%",
      cellStyle: {
        width: "18%",
        maxWidth: "18%"
      }
    }
  ];

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
              each column (field). Each row equals one record.
            </p>
            <p>
              Please{" "}
              <Link href="#" onClick={downloadSampleCsv} variant="body2">
                {"download"}
              </Link>{" "}
              a sample CSV file. Also go through{" "}
              <a href="/files/instructions.pdf" target="_blank">
                instructions
              </a>{" "}
              before proceeding further.
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
          <Grid item>
            {showProgress ? (
              <div className={classes.ProgressBar}>
                <LinearProgressWithLabel
                  value={progress}
                  style={{ height: "20px" }}
                />
              </div>
            ) : null}
          </Grid>
          <Grid item>
            <Table
              data={importHistory}
              column={column}
              defaultSortField="name"
              progressPending={loading}
              pagination={false}
              selectableRows={false}
              noDataComponent="No import history found"
            />
          </Grid>
        </CardContent>
      </Card>
      {showPreviewAndImportModal ? (
        <ImportStudentsModal
          showModal={showPreviewAndImportModal}
          closeModal={() => setShowPreviewAndImportModal(false)}
          data={fileData}
          clear={handleOnRemoveFile}
          updateStatus={id => updateStatus(id)}
        />
      ) : null}
    </Grid>
  );
};
export default StudentsImport;
