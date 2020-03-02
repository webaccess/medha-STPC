import React, { Component } from "react";
import axios from "axios";
import { InputText, Button } from "../../components";
import Select from "@material-ui/core/Select";
import Layout from "../../hoc/Layout/Layout.js";
import { withStyles } from "@material-ui/core/styles";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import { CustomRouterLink } from "../../components";
import * as routeConstants from "../../constants/RouteConstants";

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

class AddZone extends Component {
  getstates = [];
  constructor() {
    super();
    this.state = {
      addzone: "",
      getstates: [],
      stateid: 0
    };
  }
  handleChange(event) {
    this.setState({ addzone: event.target.value });
  }
  handleStateChange(event) {
    this.setState({ stateid: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    var name = this.state.addzone;
    var ID = this.state.stateid;
    axios
      .post(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES, {
        name: name,
        state: {
          id: ID
        }
      })
      .then(res => {
        window.location.reload();
      })
      .catch(error => {
        console.log("Error > ", error.response);
      });
  }
  componentDidMount() {
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES)
      .then(res => {
        this.setState({ getstates: res.data });
        this.getstates = res.data;
      });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Layout>
          <h1>Zone</h1>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <span>Zone Name </span>
            <InputText
              value={this.state.addzone}
              name="addzone"
              onChange={this.handleChange.bind(this)}
              placeholder="Add Zone"
            />
            <br></br>
            <br></br>
            <span>State Name </span>
            <Select
              placeholder="Add Zone"
              onChange={this.handleStateChange.bind(this)}
            >
              {this.state.getstates.map(states => (
                <option value={states.id} key={states.id}>
                  {" "}
                  {states.name}{" "}
                </option>
              ))}
            </Select>
            <br></br>
            <br></br>
            <Button buttonType="submit" value="submit">
              ADD
            </Button>{" "}
            <Button
              variant="contained"
              color="primary"
              disableElevation
              component={CustomRouterLink}
              to={routeConstants.VIEW_ZONES}
            >
              Cancel
            </Button>
          </form>
        </Layout>
      </div>
    );
  }
}

export default withStyles(useStyles)(AddZone);
