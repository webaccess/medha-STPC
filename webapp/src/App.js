import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { NotFoundPage, Logout } from "./components";

import * as routeConstants from "./constants/RouteConstants";
import {
  LoginRoute,
  ForgotPasswordRoute,
  RouteWithLayout,
  PrivateRoute,
  DefaultRoute
} from "./authroute";

import Dashboard from "./containers/Dashboard/Dashboard";
import AddEditCollege from "./containers/College/AddEditCollege/AddEditCollege";
import ViewCollege from "./containers/College/ManageCollege/ManageCollege";
import AddUser from "./containers/User/AddEditUser/AddEditUser";
import ViewUsers from "./containers/User/ViewUser/ViewUser";
import AddEditRpc from "./containers/RPC/AddEditRpc/AddEditRpc";
import ViewRpc from "./containers/RPC/ViewRpc/ViewRpc";
import AddEditState from "./containers/State/AddEditState/AddEditState";
import ViewStates from "./containers/State/ViewState/ViewState";
import AddZone from "./containers/Zone/AddEditZone/AddEditZone";
import ViewZone from "./containers/Zone/ViewZone/ViewZone";
import Layout from "./hoc/Layout/Layout";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import Registration from "./containers/Registration/Registration";
import RequestOtp from "./containers/OTP/Requestotp";
import VerifyOtp from "./containers/OTP/Verifyotp";
import EditCollegeRoute from "./authroute/EditCollegeRoute";
import Registered from "../src/containers/Registration/Registered.js";
import RegistrationRoute from "./containers/Registration/RegistrationRoute";
import RequiredConformation from "./components/RequiredConformation/RequiredConformation.js";

import EditStateRoute from "./authroute/EditStateRoute";
import EditZoneRoute from "./authroute/EditZoneRoute";
import EditRpcRoute from "./authroute/EditRpcRoute";
import EditUserRoute from "./authroute/EditUserRoute";
import DisplayCollegeDetails from "./containers/College/ManageCollege/DisplayCollegeDetails";
import StudentProfile from "./containers/Student/StudentProfile";
import ViewEducation from "./containers/Student/Education/ViewEducation";
import AddEducation from "./containers/Student/Education/AddEditEducation";
import editEducation from "./authroute/EditEducationRoute";
import Documents from "./containers/Student/Documents";
import SetIndexContext from "./context/SetIndexContext";
import DisplayUserDetails from "./containers/User/ViewUser/DisplayUserDetails";
import ManageStudents from "./containers/Student/ManageStudents";

function App() {
  const [index, setIndex] = useState(0);

  return (
    <SetIndexContext.Provider value={{ index, setIndex }}>
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <Switch>
              <PrivateRoute
                path={routeConstants.DASHBOARD_URL}
                component={Dashboard}
                exact
              />
              <DefaultRoute
                path={routeConstants.DEFAULT_URL}
                component={Dashboard}
                exact
              />
              <LoginRoute
                path={routeConstants.SIGN_IN_URL}
                exact
                type={"login"}
                layout={Layout}
              />
              <RequiredConformation
                path={routeConstants.REQUIRED_CONFORMATION}
                exact
              />
              <Route
                path={routeConstants.LOGOUT_URL}
                component={Logout}
                exact
              />
              <Registered
                path={routeConstants.REGISTERED}
                layout={Layout}
                exact
              />
              <RegistrationRoute
                path={routeConstants.NEW_REGISTRATION_URL}
                layout={Layout}
                exact
              />

              <RequestOtp
                path={routeConstants.REQUEST_OTP}
                layout={Layout}
                exact
              />

              <VerifyOtp
                path={routeConstants.VERIFY_OTP}
                layout={Layout}
                exact
              />

              <ForgotPasswordRoute
                path={routeConstants.FORGOT_PASSWORD_URL}
                exact
                type={"forgot-password"}
                layout={Layout}
              />
              <Route
                path={routeConstants.NOT_FOUND_URL}
                component={NotFoundPage}
                exact
              />

              <RouteWithLayout
                component={StudentProfile}
                exact
                layout={Layout}
                path={routeConstants.VIEW_PROFILE}
              />

              <RouteWithLayout
                component={ViewEducation}
                exact
                layout={Layout}
                path={routeConstants.VIEW_EDUCATION}
              />

              <RouteWithLayout
                component={AddEducation}
                exact
                layout={Layout}
                path={routeConstants.ADD_EDUCATION}
              />

              <RouteWithLayout
                component={editEducation}
                exact
                layout={Layout}
                path={routeConstants.EDIT_EDUCATION}
              />

              <RouteWithLayout
                component={Documents}
                exact
                layout={Layout}
                path={routeConstants.VIEW_DOCUMENTS}
              />

              {/** User */}
              {/** Add User **/}
              <RouteWithLayout
                component={AddUser}
                exact
                layout={Layout}
                path={routeConstants.ADD_USER}
              />
              {/** View User */}
              <RouteWithLayout
                component={ViewUsers}
                exact
                layout={Layout}
                path={routeConstants.VIEW_USER}
              />
              {/** Edit User Route*/}
              <RouteWithLayout
                component={EditUserRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_USER}
              />
              {/** View User Data*/}
              <RouteWithLayout
                component={DisplayUserDetails}
                exact
                layout={Layout}
                path={routeConstants.DETAIL_USER}
              />
              {/** State */}
              {/** Add Edit State */}
              <RouteWithLayout
                component={AddEditState}
                exact
                layout={Layout}
                path={routeConstants.ADD_STATES}
              />
              {/** Edit State Route */}
              <RouteWithLayout
                component={EditStateRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_STATE}
              />
              <RouteWithLayout
                component={ViewStates}
                exact
                layout={Layout}
                path={routeConstants.VIEW_STATES}
              />
              {/** Rpc */}
              <RouteWithLayout
                component={AddEditRpc}
                exact
                layout={Layout}
                path={routeConstants.ADD_RPC}
              />
              <RouteWithLayout
                component={ViewRpc}
                exact
                layout={Layout}
                path={routeConstants.VIEW_RPC}
              />
              <RouteWithLayout
                component={EditRpcRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_RPC}
              />

              {/** Zone */}
              <RouteWithLayout
                component={AddZone}
                exact
                layout={Layout}
                path={routeConstants.ADD_ZONES}
              />
              <RouteWithLayout
                component={ViewZone}
                exact
                layout={Layout}
                path={routeConstants.VIEW_ZONES}
              />
              <RouteWithLayout
                component={EditZoneRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_ZONES}
              />

              {/** College */}
              {/** Add College */}
              <RouteWithLayout
                component={DisplayCollegeDetails}
                exact
                layout={Layout}
                path={routeConstants.DETAIL_COLLEGE}
              />
              <RouteWithLayout
                component={AddEditCollege}
                exact
                layout={Layout}
                path={routeConstants.ADD_COLLEGE}
              />
              {/** Edit College Route */}
              <RouteWithLayout
                component={EditCollegeRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_COLLEGE}
              />
              {/** View College */}
              <RouteWithLayout
                component={ViewCollege}
                exact
                layout={Layout}
                path={routeConstants.VIEW_COLLEGE}
              />
              {/** Manage Student */}
              <RouteWithLayout
                component={ManageStudents}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_STUDENT}
              />
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    </SetIndexContext.Provider>
  );
}
export default App;
