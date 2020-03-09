import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import DynamicFormSchema from "./DynamicFormSchema";
import { Card, Grid, TextField, CardContent } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  margin: {
    marginTop: theme.spacing(2)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  }
}));

const DynamicBar = props => {
  const classes = useStyles();
  return props.dynamicBar.map((val, idx) => {
    let stream = `stream-${idx}`,
      strength = `strength-${idx}`;
    return (
      <Card id="outlined-stream-card" fullWidth>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md xs>
              <TextField
                label="stream"
                name="stream"
                variant="outlined"
                fullWidth
                data-id={idx}
                id={stream}
              />
            </Grid>
            <Grid item md xs>
              <TextField
                label="strength"
                name="strength"
                variant="outlined"
                fullWidth
                data-id={idx}
                id={strength}
              />
            </Grid>
            <Grid item md xs>
              {idx > 0 ? (
                <DeleteForeverOutlinedIcon onClick={() => props.delete(val)} />
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  });
};

export default DynamicBar;
