import React, { forwardRef } from "react";
import axios from "axios";
import { NavLink as RouterLink } from "react-router-dom";
import { Table, Modal, Spinner } from "../../components";
import { TextField, Button, Select } from "@material-ui/core";
import * as routeConstants from "../../constants/RouteConstants";

export default class ViewRpc extends React.Component {
  statename = [];
  constructor(props) {
    super(props);
    this.state = {
      getrpc: [],
      getstates: [],
      isShowing: false,
      DeleteIsShowing: false,
      selectedid: [],
      getzone: [],
      editrpc: [],
      editzone: []
    };
  }

  componentDidMount() {
    axios.get("http://192.168.2.87:1337/rpcs").then(res => {
      console.log(res.data);
      this.setState({ getrpc: res.data });
    });
    axios.get("http://192.168.2.87:1337/states").then(res => {
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
    console.log("changedstate", event.target.value);
    // this.setState({ statename : event.target.value });
    this.statename = event.target.value;
    axios
      .get("http://192.168.2.87:1337/zones?state.name=" + this.statename)
      .then(res => {
        console.log("this.state.statename", this.state.statename);
        console.log("res", res.data);
        this.setState({ getzone: res.data });
      });
  };
  handleEditRpcChange = event => {
    console.log("handleEditRpcChange", event.target.value);
    this.setState({ editrpc: event.target.value });
  };
  handleEditZoneChange = event => {
    console.log("handleEditZoneChange", event.target.value);
    this.setState({ editzone: event.target.value });
  };
  editRpc = () => {
    // alert("done");
    axios
      .put("http://192.168.2.87:1337/rpcs/" + this.state.selectedid, {
        name: this.state.editrpc,
        zone: this.state.editzone
      })
      .then(res => {
        console.log("res", res);
        window.location.reload();
      })
      .catch(error => {
        console.log(error.response);
      });
  };
  closeDeleteModalHandler = () => {
    this.setState({ DeleteIsShowing: false });
  };
  deleteRpc = () => {
    axios
      .delete("http://192.168.2.87:1337/rpcs/" + this.state.selectedid)
      .then(res => {
        // this.setState({ addstates: res.data });
        console.log("editresult", res.data);
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
      { name: "RPC", sortable: true, selector: "name" },
      { name: "zone", sortable: true, selector: "zone" }
    ];
    this.data = [];
    for (let i in this.state.getrpc) {
      var temp = {};
      temp["id"] = this.state.getrpc[i]["id"];
      temp["name"] = this.state.getrpc[i]["name"];
      temp["zone"] = this.state.getrpc[i]["zone"]["name"];
      // temp["main_college"] = this.state.getrpc[i]["main_college"]["name"];
      this.data.push(temp);
      console.log("data", this.data);
    }
    return (
      <div className="App">
        <Button
          color="primary"
          variant="contained"
          to={routeConstants.ADD_RPC}
          component={this.CustomRouterLink}
        >
          Add rpc
        </Button>
        {this.data.length ? (
          <Table
            title={""}
            filterData={true}
            filterBy={["name", "zone"]}
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
          event={this.editRpc}
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
            label="RPc"
            onChange={this.handleEditRpcChange}
            variant="outlined"
          />
          state:
          <Select placeholder="Add Zone" onChange={this.handleEditStateChange}>
            {this.state.getstates.map(states => (
              <option value={states.name} key={states.id}>
                {" "}
                {states.name}{" "}
              </option>
            ))}
          </Select>
          zone:
          <Select placeholder="Add Zone" onChange={this.handleEditZoneChange}>
            {this.state.getzone.map(zone => (
              <option value={zone.id} key={zone.id}>
                {" "}
                {zone.name}{" "}
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
          event={this.deleteRpc}
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
