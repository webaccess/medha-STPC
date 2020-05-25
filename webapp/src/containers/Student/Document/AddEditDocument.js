import React, { useState, useContext } from "react";
import useStyles from "../StudentStyles.js";
import { get } from "lodash";
import { Card, CardActions, Grid, TextField, Button } from "@material-ui/core";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants.js";
import * as serviceProviders from "../../../api/Axios";
import { Alert, GrayButton, YellowButton, Spinner } from "../../../components";
import { useHistory } from "react-router-dom";
import DocumentSchema from "../DocumentSchema.js";
import auth from "../../../components/Auth/Auth.js";
import Img from "react-image";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import LoaderContext from "../../../context/LoaderContext";

const field = "documents";
const ref = "individual";
const files = "files";
const source = "crm-plugin";

const AddEditDocument = props => {
  const history = useHistory();
  const classes = useStyles();
  const DOCUMENT_URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_UPLOAD;

  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    counter: 0,
    files: {},
    showNoImage: true,
    showPreview: false
  });

  /** This handle change is used to handle changes to text field */
  const handleChange = event => {
    /** TO SET VALUES IN FORMSTATE */
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      },
      files: event.target.files[0],
      previewFile: URL.createObjectURL(event.target.files[0]),
      showPreview: true,
      showNoImage: false
    }));

    /** This is used to remove any existing errors if present in text field */
    if (formState.errors.hasOwnProperty(event.target.name)) {
      delete formState.errors[event.target.name];
    }
  };

  /** This checks if the corresponding field has errors */
  const hasError = field => (formState.errors[field] ? true : false);

  /** Handle submit handles the submit and performs all the validations */
  const handleSubmit = event => {
    setLoaderStatus(true);
    let isValid = false;
    // /** Checkif all fields are present in the submitted form */
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      DocumentSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        DocumentSchema
      );
      /** Checks if the form is empty */
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        DocumentSchema
      );
      /** This sets errors by comparing it with the json schema provided */
      formState.errors = formUtilities.setErrors(
        formState.values,
        DocumentSchema
      );
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      postUploadData();
    } else {
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    event.preventDefault();
  };

  const postUploadData = async () => {
    const studentInfo =
      auth.getUserInfo() !== null && auth.getUserInfo().role.name === "Student"
        ? auth.getUserInfo().studentInfo.id
        : auth.getStudentIdFromCollegeAdmin();
    const id = studentInfo;
    let postData = databaseUtilities.uploadDocument(
      formState.files,
      ref,
      id,
      field,
      source
    );

    serviceProviders
      .serviceProviderForPostRequest(DOCUMENT_URL, postData)
      .then(res => {
        setIsSuccess(true);
        history.push({
          pathname: routeConstants.VIEW_DOCUMENTS,
          fromAddDocument: true,
          isDataAdded: true,
          addResponseMessage: "",
          addedData: {}
        });
        setLoaderStatus(false);
      })
      .catch(error => {
        history.push({
          pathname: routeConstants.VIEW_DOCUMENTS,
          fromAddDocument: true,
          isDataAdded: false,
          addResponseMessage: "",
          addedData: {}
        });
        setLoaderStatus(false);
      });
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        {isSuccess ? (
          <Alert severity="success">
            {genericConstants.ALERT_SUCCESS_BUTTON_MESSAGE}
          </Alert>
        ) : null}
        {isFailed ? (
          <Alert severity="error">
            {genericConstants.ALERT_ERROR_BUTTON_MESSAGE}
          </Alert>
        ) : null}
      </Grid>
      <Card>
        <Grid item xs={12} md={6} xl={3} className={classes.formgrid}>
          <Grid container className={classes.formgridInputFile}>
            <Grid item md={10} xs={12}>
              <div className={classes.imageDiv}>
                {formState.showPreview ? (
                  <Img
                    alt="abc"
                    loader={<Spinner />}
                    className={classes.UploadImage}
                    src={formState.previewFile}
                  />
                ) : null}
                {!formState.showPreview && !formState.showEditPreview ? (
                  <div class={classes.DefaultNoImage}></div>
                ) : null}
              </div>
            </Grid>
          </Grid>
          <Grid container className={classes.MarginBottom}>
            <Grid item md={10} xs={12}>
              <TextField
                fullWidth
                id="files"
                margin="normal"
                name="files"
                placeholder="Upload Logo"
                onChange={handleChange}
                required
                type="file"
                inputProps={{ accept: "image/*" }}
                //value={formState.values["files"] || ""}
                error={hasError("files")}
                helperText={
                  hasError("files")
                    ? formState.errors["files"].map(error => {
                        return error + " ";
                      })
                    : null
                }
                variant="outlined"
                className={classes.inputFile}
              />
              <label htmlFor={get(DocumentSchema["files"], "id")}>
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  fullWidth
                  className={classes.InputFileButton}
                  startIcon={<AddOutlinedIcon />}
                >
                  ADD NEW FILE
                </Button>
              </label>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <CardActions className={classes.btnspace}>
            <YellowButton
              onClick={handleSubmit}
              color="primary"
              variant="contained"
            >
              {genericConstants.SAVE_BUTTON_TEXT}
            </YellowButton>
            <GrayButton
              type="submit"
              color="primary"
              variant="contained"
              to={routeConstants.VIEW_DOCUMENTS}
            >
              {genericConstants.CANCEL_BUTTON_TEXT}
            </GrayButton>
          </CardActions>
        </Grid>
      </Card>
      {/* <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    id={get(DocumentSchema[files], "id")}
                    margin="normal"
                    name={files}
                    onChange={handleChange}
                    required
                    type={get(DocumentSchema[files], "type")}
                    value={formState.values[files] || ""}
                    error={hasError(files)}
                    helperText={
                      hasError(files)
                        ? formState.errors[files].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                    className={classes.elementroot}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.btnspace}>
              <YellowButton type="submit" color="primary" variant="contained">
                {genericConstants.SAVE_BUTTON_TEXT}
              </YellowButton>
              <GrayButton
                type="submit"
                color="primary"
                variant="contained"
                to={routeConstants.VIEW_DOCUMENTS}
              >
                {genericConstants.CANCEL_BUTTON_TEXT}
              </GrayButton>
            </CardActions>
          </form>
        </Card>
                  </Grid>*/}
    </Grid>
  );
};
export default AddEditDocument;
