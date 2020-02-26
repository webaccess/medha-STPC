import React, { Component } from "react";
import axios from "axios";
import Layout from "../../hoc/Layout/Layout.js";
import { InputText, Button } from "../../components";
import { withStyles } from "@material-ui/core/styles";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import useStyles from "./AddStateStyles";

class AddState extends Component {
  constructor() {
    super();
    this.state = {
      addstate: ""
    };
  }
  handleChange(event) {
    this.setState({ addstate: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    var name = this.state.addstate;
    axios
      .post(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES, {
        name
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
          <div>
            <h1>States</h1>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <span>State Name </span>
              <InputText
                value={this.state.addstate}
                name="addstate"
                onChange={this.handleChange.bind(this)}
                placeholder="Add States"
              />
              <br></br>
              <div className={classes.button}>
                <Button type="submit" value="submit">
                  Save
                </Button>{" "}
                <Button>Cancel</Button>
              </div>
            </form>
            {/* <Viewstates /> */}
          </div>
        </Layout>
      </div>
    );
  }
}

export default withStyles(useStyles)(AddState);
