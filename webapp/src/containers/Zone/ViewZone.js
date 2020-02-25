import React, { forwardRef } from "react";
import axios from "axios";
import Table from "../../components/DataTable/Table.js";
import { TextField, Button } from "@material-ui/core";
import Modal from "../../components/UI/Modal/Modal";
import Select from "@material-ui/core/Select";
import * as strapiConstants from "../../components/Constants/StrapiApiConstants";
import Spinner from "../../components/UI/Spinner/Spinner";
import { NavLink as RouterLink } from "react-router-dom";
import * as routeConstants from "../../components/Constants/RouteConstants";
import styles from "./Zone.module.css";

export default class Viewzone extends React.Component {
  isShowing = false;
  constructor(props) {
    super(props);
    this.state = {
      viewzones: [],
      isShowing: false,
      DeleteIsShowing: false,
      selectedid: [],
      getstates: [],
      editstate: [],
      editzone: []
    };
    let data = [];
  }

  componentDidMount() {
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES)
      .then(res => {
        this.setState({ viewzones: res.data });
      });
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES)
      .then(res => {
        this.setState({ getstates: res.data });
        this.getstates = res.data;
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

  closeModalHandler = () => {
    this.setState({ isShowing: false });
  };

  handleEditStateChange = event => {
    this.setState({ editstate: event.target.value });
  };

  handleEditZoneChange = event => {
    this.setState({ editzone: event.target.value });
  };

  editZone = () => {
    axios
      .put(
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_ZONES +
          this.state.selectedid,
        {
          name: this.state.editzone,
          state: this.state.editstate
        }
      )
      .then(res => {
        window.location.reload();
      })
      .catch(error => {
        console.log("Error > ", error.response);
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
  deleteZone = () => {
    axios
      .delete("http://192.168.2.87:1337/zones/" + this.state.selectedid)
      .then(res => {
        window.location.reload();
      });
  };

  CustomRouterLink = forwardRef((props, ref) => (
    <div ref={ref}>
      <RouterLink {...props} />
    </div>
  ));

  render() {
    const column = [
      { name: "Zone", sortable: true, selector: "name" },
      { name: "States", sortable: true, selector: "state" }
    ];
    this.data = [];
    for (let i in this.state.viewzones) {
      var temp = {};
      temp["id"] = this.state.viewzones[i]["id"];
      temp["name"] = this.state.viewzones[i]["name"];
      temp["state"] = this.state.viewzones[i]["state"]["name"];
      this.data.push(temp);
    }
    return (
      <div className="App">
        <Button
          color="primary"
          variant="contained"
          to={routeConstants.ADD_ZONES}
          component={this.CustomRouterLink}
          className={styles.addbutton}
        >
          Add zones
        </Button>
        {this.data.length ? (
          <Table
            title={""}
            filterData={true}
            filterBy={["state", "name"]}
            data={this.data}
            column={column}
            events={this.geteditit}
            eventsss={this.getdeleteid}
          />
        ) : (
          <Spinner />
        )}
        <Modal
          className="modal"
          show={this.state.isShowing}
          close={this.closeModalHandler}
          header=""
          displayCross={{ display: "none" }}
          event={this.editZone}
          footer={{
            footerSaveName: "OKAY",
            footerCloseName: "CLOSE",
            displayClose: { display: "true" },
            displaySave: { display: "true" }
          }}
        >
          Edit Data?
          <TextField
            id="outlined-basic"
            label="Zone"
            onChange={this.handleEditZoneChange}
            variant="outlined"
          />
          <Select placeholder="Add Zone" onChange={this.handleEditStateChange}>
            {this.state.getstates.map(states => (
              <option value={states.id} key={states.id}>
                {" "}
                {states.name}{" "}
              </option>
            ))}
          </Select>
        </Modal>
        <Modal
          className="modal"
          show={this.state.DeleteIsShowing}
          close={this.closeDeleteModalHandler}
          header=""
          displayCross={{ display: "none" }}
          event={this.deleteZone}
          footer={{
            footerSaveName: "OKAY",
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
