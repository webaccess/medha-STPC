import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AppRouter from "./AppRouter";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import SetIndexContext from "./context/SetIndexContext";
import LoaderContext from "./context/LoaderContext";

function App(props) {
  const [index, setIndex] = useState(0);
  const [loaderStatus, setLoaderStatus] = useState(false);
  return (
    <LoaderContext.Provider value={{ loaderStatus, setLoaderStatus }}>
      <SetIndexContext.Provider value={{ index, setIndex }}>
        <ThemeProvider theme={theme}>
          <Router>
            <AppRouter />
          </Router>
        </ThemeProvider>
      </SetIndexContext.Provider>
    </LoaderContext.Provider>
  );
}
export default App;
