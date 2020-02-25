import React, { forwardRef } from "react";
import axios from "axios";
import Table from "../../components/DataTable/Table.js";
import { TextField, Button } from "@material-ui/core";
import Modal from "../../components/UI/Modal/Modal";
import * as strapiConstants from "../../components/Constants/StrapiApiConstants";
import * as routeConstants from "../../components/Constants/RouteConstants";
import Spinner from "../../components/UI/Spinner/Spinner";
import { NavLink as RouterLink } from "react-router-dom";
import styles from "./State.module.css";

const useStyles = theme => ({
  button: {
    marginTop: "25px",
    marginLeft: "50px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});

export default class Viewstates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addstates: [],
      isShowing: false,
      DeleteIsShowing: false,
      editstate: [],
      selectedid: 0
    };
  }
  componentDidMount() {
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES)
      .then(res => {
        this.setState({ addstates: res.data });
      });
  }
  geteditit = cellid => {
    this.setState({ selectedid: cellid });
    this.setState({ isShowing: true });
  };
  getdeleteid = cellid => {
    this.setState({ selectedid: cellid });
    this.setState({ DeleteIsShowing: true });
  };
  editState = () => {
    var name = this.state.editstate;
    axios
      .put(
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STATES +
          this.state.selectedid,
        { name }
      )
      .then(res => {
        window.location.reload();
      });
  };
  closeModalHandler = () => {
    this.setState({ isShowing: false });
  };
  closeDeleteModalHandler = () => {
    this.setState({ DeleteIsShowing: false });
  };
  handleEditChange = event => {
    this.setState({ editstate: event.target.value });
    console.log("handleEditChange", this.state.editstate);
  };
  CustomRouterLink = forwardRef((props, ref) => (
    <div ref={ref}>
      <RouterLink {...props} />
    </div>
  ));

  handleAddButtonClick = e => {};
  deleteState = () => {
    axios
      .delete(
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STATES +
          this.state.selectedid
      )
      .then(res => {
        window.location.reload();
      });
  };

  render() {
    const column = [
      {
        name: "States",
        sortable: true,
        selector: "name"
      }
    ];
    let data = this.state.addstates;
    return (
      <div>
        <Button
          color="primary"
          variant="contained"
          to={routeConstants.ADD_STATES}
          component={this.CustomRouterLink}
          className={styles.addbutton}
        >
          Add state
        </Button>
        {data.length ? (
          <div>
            {" "}
            <Table
              column={column}
              data={data}
              filterBy={"name"}
              filterdata={true}
              events={this.geteditit}
              eventsss={this.getdeleteid}
            />
          </div>
        ) : (
          <Spinner />
        )}
        <Modal
          className="modal"
          show={this.state.isShowing}
          close={this.closeModalHandler}
          header=""
          displayCross={{ display: "none" }}
          event={this.editState}
          footer={{
            footerSaveName: "OK",
            footerCloseName: "CLOSE",
            displayClose: { display: "true" },
            displaySave: { display: "true" }
          }}
        >
          Edit Data?
          <TextField
            id="outlined-basic"
            label="State"
            value={this.state.editstate}
            variant="outlined"
            onChange={this.handleEditChange}
          />
        </Modal>
        <Modal
          className="modal"
          show={this.state.DeleteIsShowing}
          close={this.closeDeleteModalHandler}
          header=""
          displayCross={{ display: "none" }}
          event={this.deleteState}
          footer={{
            footerSaveName: "OK",
            footerCloseName: "CLOSE",
            displayClose: { display: "true" },
            displaySave: { display: "true" }
          }}
        >
          Are you sure ? Do you want to delete
        </Modal>
      </div>
    );
  }
}
