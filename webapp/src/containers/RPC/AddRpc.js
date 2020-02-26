import React, { Component } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";

import { InputText, Button } from "../../components";

import Select from "@material-ui/core/Select";
import Layout from "../../hoc/Layout/Layout.js";

import * as strapiConstants from "../../constants/StrapiApiConstants";

const useStyles = theme => ({
  button: {
    marginTop: "25px",
    marginLeft: "75px"
  },
  align: {
    marginLeft: "250px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});
class AddRpc extends Component {
  statename = [];
  zoneid = "";
  collegeid = "";
  constructor() {
    super();
    this.state = {
      addrpc: "",
      getstates: [],
      getzone: [],
      statename: "",
      zoneid: "",
      getcollege: []
    };
  }
  componentDidMount() {
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES)
      .then(res => {
        this.setState({ getstates: res.data });
      });
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES)
      .then(res => {
        this.setState({ getcollege: res.data });
      });
  }
  handleChange(event) {
    this.setState({ addrpc: event.target.value });
  }
  handleStateChange(event) {
    this.statename = event.target.value;
    axios
      .get("http://192.168.2.87:1337/zones?state.name=" + this.statename)
      .then(res => {
        this.setState({ getzone: res.data });
      });
  }
  handleZoneChange(event) {
    this.zoneid = event.target.value;
  }
  handleCollegeChange(event) {
    this.collegeid = event.target.value;
  }
  handleSubmit(event) {
    event.preventDefault();
    var name = this.state.addrpc;
    var ID = this.zoneid;
    var clgid = this.collegeid;
    axios
      .post("http://192.168.2.87:1337/rpcs", {
        name: name,
        zone: {
          id: ID
        },
        main_college: {
          id: clgid
        }
      })
      .then(res => {
        window.location.reload();
      })
      .catch(error => {
        console.log("Error > ", error.response);
      });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Layout>
          <h1>RPCs</h1>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <span>RPC Name </span>
            <InputText
              name="addrpc"
              placeholder="Add RPC"
              onChange={this.handleChange.bind(this)}
            />
            <br></br>
            <br></br>
            <span>State Name</span>
            <Select
              placeholder="Add State"
              onChange={this.handleStateChange.bind(this)}
            >
              {this.state.getstates.map(states => (
                <option value={states.name} key={states.id}>
                  {" "}
                  {states.name}{" "}
                </option>
              ))}
            </Select>
            <br></br>
            <br></br>
            <span>Zone Name</span>
            <Select
              placeholder="Add Zone"
              onChange={this.handleZoneChange.bind(this)}
            >
              {this.state.getzone.map(zone => (
                <option value={zone.id} key={zone.id}>
                  {" "}
                  {zone.name}{" "}
                </option>
              ))}
            </Select>
            <br></br>
            <br></br>
            <span>College Name</span>
            <Select
              placeholder="Add Zone"
              onChange={this.handleCollegeChange.bind(this)}
            >
              {this.state.getcollege.map(college => (
                <option value={college.id} key={college.id}>
                  {" "}
                  {college.name}{" "}
                </option>
              ))}
            </Select>
            <br></br>
            <br></br>
            <Button type="submit" value="submit">
              ADD
            </Button>{" "}
            <Button>Cancel</Button>
          </form>
        </Layout>
      </div>
    );
  }
}

export default withStyles(useStyles)(AddRpc);
