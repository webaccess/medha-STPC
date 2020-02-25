import React, { Component, Fragment } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from "@material-ui/core";
import clsx from "clsx";

const useStyles = theme => ({
  formControl: {
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  root: {}
});

class Adduser extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    contact: "",
    getstates: [],
    getzone: [],
    getcollege: [],
    getrpc: [],
    getroles: []
  };

  changedstate = [];
  chnageszone = [];
  changecollege = [];
  changedrpc = [];
  rolechanges = [];

  postDataHandler = () => {
    const formData = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      first_name: this.state.firstname,
      last_name: this.state.lastname,
      contact_number: parseInt(this.state.contact),
      state: this.changedstate,
      zone: this.chnageszone,
      college: this.changecollege,
      rpc: this.changedrpc,
      role: this.rolechanges
    };

    axios
      .post("http://192.168.2.87:1337/users", formData)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  componentDidMount() {
    axios.get("http://192.168.2.87:1337/states").then(res => {
      this.setState({ getstates: res.data });
    });

    axios.get("http://192.168.2.87:1337/zones").then(res => {
      this.setState({ getzone: res.data });
    });

    axios.get("http://192.168.2.87:1337/colleges").then(res => {
      this.setState({ getcollege: res.data });
    });
    axios.get("http://192.168.2.87:1337/rpcs").then(res => {
      this.setState({ getrpc: res.data });
    });
    axios.get("http://192.168.2.87:1337/users-permissions/roles").then(res => {
      console.log(res);
      this.setState({ getroles: res.data.roles });
    });
  }

  changeHandler = event => {
    this.changedstate = event.target.value;
    console.log(this.changedstate);
  };

  zoneHandler = event => {
    this.chnageszone = event.target.value;
    console.log(this.chnageszone);
  };

  collegeHandler = event => {
    this.changecollege = event.target.value;
    console.log(this.changecollege);
  };

  rpcHandler = event => {
    this.changedrpc = event.target.value;
    console.log(this.changedrpc);
  };

  roleHandler = event => {
    this.rolechanges = event.target.value;
    console.log(this.rolechanges);
  };

  render() {
    const { classes, className, ...rest } = this.props;

    let selschool = this.state.getstates;
    let schoolsel = selschool.map(states => (
      <MenuItem value={states.id} key={states.id}>
        {" "}
        {states.name}{" "}
      </MenuItem>
    ));

    let rolecd = this.state.getroles;
    let changedroles = rolecd.map(role => (
      <MenuItem value={role.id} key={role.id}>
        {" "}
        {role.name}{" "}
      </MenuItem>
    ));

    let cldgecd = this.state.getcollege;
    let colgemap = cldgecd.map(colge => (
      <MenuItem value={colge.id} key={colge.id}>
        {" "}
        {colge.name}{" "}
      </MenuItem>
    ));

    let zonch = this.state.getcollege;
    let zonmap = zonch.map(colge => (
      <MenuItem value={colge.id} key={colge.id}>
        {" "}
        {colge.name}{" "}
      </MenuItem>
    ));

    let rpccd = this.state.getrpc;
    let rpcmap = rpccd.map(rpc => (
      <MenuItem value={rpc.id} key={rpc.id}>
        {" "}
        {rpc.name}{" "}
      </MenuItem>
    ));

    return (
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Add User" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  label="FirstName"
                  name="firstname"
                  value={this.state.firstname}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    this.setState({ firstname: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="LastName"
                  name="lastname"
                  value={this.state.lastname}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    this.setState({ lastname: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={this.state.email}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Contact"
                  name="contact"
                  value={this.state.contact}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    this.setState({ contact: event.target.value })
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item md={4} xs={12}>
                <TextField
                  label="UserName"
                  name="username"
                  value={this.state.username}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    this.setState({ username: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  value={this.state.password}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    this.setState({ password: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  label="Confirm Password"
                  name="cpassword"
                  value=""
                  variant="outlined"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-label">State</InputLabel>
                  <Select placeholder="Add state" onChange={this.changeHandler}>
                    <MenuItem>Select State</MenuItem>
                    {schoolsel}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-label">Zone</InputLabel>
                  <Select placeholder="Add Zone" onChange={this.zoneHandler}>
                    <MenuItem>Select Zone</MenuItem>
                    {zonmap}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <span>Is Active</span>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-label">College</InputLabel>
                  <Select
                    placeholder="Add College"
                    onChange={this.collegeHandler}
                  >
                    <MenuItem>Select College</MenuItem>
                    {colgemap}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-label">RPC</InputLabel>
                  <Select placeholder="Add RPC" onChange={this.rpcHandler}>
                    <MenuItem>Select RPC</MenuItem>
                    {rpcmap}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select placeholder="Add Role" onChange={this.roleHandler}>
                    <MenuItem>Select Role</MenuItem>
                    {changedroles}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              onClick={this.postDataHandler}
              variant="contained"
              color="primary"
              href="#contained-buttons"
            >
              Add User
            </Button>
          </CardActions>
        </form>
      </Card>
    );
  }
}
//export default Adduser;
export default withStyles(useStyles)(Adduser);
