import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { NotFoundPage, Logout } from "./components";

import * as routeConstants from "./constants/RouteConstants";
import {
  LoginRoute,
  ForgotPasswordRoute,
  RouteWithLayout,
  PrivateRoute,
  DashBoardComponent,
  MedhaCollegeAdminRoute
} from "./authroute";

import RouteWithTabLayout from "./authroute/RouteWithTabLayout.js";

import Dashboard from "./containers/Dashboard/Dashboard";
import AddEditCollege from "./containers/College/AddEditCollege/AddEditCollege";
import ManageCollege from "./containers/College/ManageCollege/ManageCollege";
import AddUser from "./containers/User/AddEditUser/AddEditUser";
import ManageUser from "./containers/User/ManageUser/ManageUser";
import AddEditRpc from "./containers/RPC/AddEditRpc/AddEditRpc";
import ManageRpc from "./containers/RPC/ManageRpc/ManageRpc";
import AddEditState from "./containers/State/AddEditState/AddEditState";
import ManageState from "./containers/State/ManageState/ManageState";
import AddZone from "./containers/Zone/AddEditZone/AddEditZone";
import ManageZone from "./containers/Zone/ManageZone/ManageZone";
import ViewEvents from "./containers/Event/ManageEvent/ManageEvent";
import AddEditEvent from "./containers/Event/AddEditEvent/AddEditEvent";
import StudentList from "./containers/Event/ManageEvent/EventStudentList";
import Layout from "./hoc/Layout/Layout";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
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
import ViewCollege from "./containers/College/ManageCollege/ViewCollege";
import StudentProfile from "./containers/Student/StudentProfile";
import ViewEducation from "./containers/Student/Education/ViewEducation";
import AddEducation from "./containers/Student/Education/AddEditEducation";
import EditEducation from "./authroute/EditEducationRoute";
import ViewDocument from "./containers/Student/Document/ViewDocument";
import AddDocument from "./containers/Student/Document/AddEditDocument";
import SetIndexContext from "./context/SetIndexContext";
import ViewUser from "./containers/User/ManageUser/ViewUser";
import ManageStudents from "./containers/Student/ManageStudents";
import ViewAcademicHistory from "./containers/Student/AcademicHistory/ViewAcademicHistory";
import AddEditAcademicHistory from "./containers/Student/AcademicHistory/AddEditAcademicHistory";
import EditAcademicHistoryRoute from "./authroute/EditAcademicHistoryRoute";
import ViewEvent from "./containers/Event/ViewEvent/ViewEvent";
import EditEventRoute from "./authroute/EditEventRoutes";
import EligibleEvents from "./containers/Event/EligibleEvents/EligibleEvents";

import ViewActivity from "./containers/Activity/ViewActivity.js";
import AddEditActivity from "./containers/Activity/AddEditActivity";
import ActivityRoute from "./containers/Activity/ActivityRoute.js";
import ActivityDetails from "./containers/Activity/ActivityDetails";
import EligibleActivity from "./containers/Activity/EligibleActivity";

import ViewActivityBatches from "./containers/Activity/ActivityBatch/ViewActivityBatches";
import AddEditActivityBatch from "./containers/Activity/ActivityBatch/AddEditActivityBatch";
import EditActivityBatchRoute from "./authroute/EditActivityBatchRoute";
import AddEditStudent from "./containers/Registration/AddEditStudent";
function App() {
  const [index, setIndex] = useState(0);

  return (
    <SetIndexContext.Provider value={{ index, setIndex }}>
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <Switch>
              <DashBoardComponent
                path={routeConstants.DEFAULT_URL}
                component={Dashboard}
                exact
              />
              <PrivateRoute
                path={routeConstants.DASHBOARD_URL}
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
              {/**Student Registration route */}
              <RegistrationRoute
                path={routeConstants.NEW_REGISTRATION_URL}
                layout={Layout}
                exact
              />
              {/**Edit Student Profile */}
              <RouteWithTabLayout
                path={routeConstants.EDIT_PROFILE}
                layout={Layout}
                exact
                component={AddEditStudent}
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
              {/**View Student Profile  */}

              <RouteWithTabLayout
                component={StudentProfile}
                exact
                layout={Layout}
                path={routeConstants.VIEW_PROFILE}
              />
              {/**Education */}
              <RouteWithTabLayout
                component={ViewEducation}
                exact
                layout={Layout}
                path={routeConstants.VIEW_EDUCATION}
              />

              <RouteWithTabLayout
                component={AddEducation}
                exact
                layout={Layout}
                path={routeConstants.ADD_EDUCATION}
              />

              <RouteWithTabLayout
                component={EditEducation}
                exact
                layout={Layout}
                path={routeConstants.EDIT_EDUCATION}
              />
              {/**Student document */}
              <RouteWithTabLayout
                component={ViewDocument}
                exact
                layout={Layout}
                path={routeConstants.VIEW_DOCUMENTS}
              />

              <RouteWithTabLayout
                component={AddDocument}
                exact
                layout={Layout}
                path={routeConstants.ADD_DOCUMENTS}
              />
              {/** Activity List*/}
              <RouteWithLayout
                component={ViewActivity}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_ACTIVITY}
              />
              {/**Activity Details */}
              <RouteWithLayout
                component={ActivityDetails}
                exact
                layout={Layout}
                path={routeConstants.VIEW_ACTIVITY}
              />
              {/**Add  Activity */}
              <ActivityRoute
                component={AddEditActivity}
                exact
                layout={Layout}
                path={routeConstants.ADD_ACTIVITY}
              />
              {/**Edit Activity */}
              <ActivityRoute
                component={AddEditActivity}
                exact
                layout={Layout}
                path={routeConstants.EDIT_ACTIVITY}
              />
              {/**Eligible Activity */}
              <RouteWithLayout
                component={EligibleActivity}
                exact
                layout={Layout}
                path={routeConstants.ELIGIBLE_ACTIVITY}
              />

              {/**Student Academic history */}
              <RouteWithTabLayout
                component={ViewAcademicHistory}
                exact
                layout={Layout}
                path={routeConstants.VIEW_ACADEMIC_HISTORY}
              />

              <RouteWithTabLayout
                component={AddEditAcademicHistory}
                exact
                layout={Layout}
                path={routeConstants.ADD_ACADEMIC_HISTORY}
              />

              <RouteWithTabLayout
                component={EditAcademicHistoryRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_ACADEMIC_HISTORY}
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
                component={ManageUser}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_USER}
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
                component={ViewUser}
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
                component={ManageState}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_STATES}
              />
              {/** Rpc */}
              <RouteWithLayout
                component={AddEditRpc}
                exact
                layout={Layout}
                path={routeConstants.ADD_RPC}
              />
              <RouteWithLayout
                component={ManageRpc}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_RPC}
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
                component={ManageZone}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_ZONES}
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
                component={ViewCollege}
                exact
                layout={Layout}
                path={routeConstants.VIEW_COLLEGE}
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
                component={ManageCollege}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_COLLEGE}
              />
              {/** Manage Student */}
              <RouteWithLayout
                component={ManageStudents}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_STUDENT}
              />
              {/** Event */}
              <MedhaCollegeAdminRoute
                component={ViewEvents}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_EVENT}
              />
              <RouteWithLayout
                component={ViewEvent}
                exact
                layout={Layout}
                path={routeConstants.VIEW_EVENT}
              />
              <RouteWithLayout
                component={AddEditEvent}
                exact
                layout={Layout}
                path={routeConstants.ADD_EVENT}
              />
              {/**Eligible Events */}
              <RouteWithLayout
                component={EligibleEvents}
                exact
                layout={Layout}
                path={routeConstants.ELIGIBLE_EVENT}
              />
              {/** Edit Event Route */}
              <RouteWithLayout
                component={EditEventRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_EVENT}
              />

              {/* Manage Activity Batch */}
              <RouteWithLayout
                component={ViewActivityBatches}
                exact
                layout={Layout}
                path={routeConstants.MANAGE_ACTIVITY_BATCH}
              />

              <RouteWithLayout
                component={EditActivityBatchRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_ACTIVITY_BATCH}
              />

              <RouteWithLayout
                component={AddEditActivityBatch}
                exact
                layout={Layout}
                path={routeConstants.ADD_ACTIVITY_BATCH}
              />

              {/** Event Student List Route */}
              <MedhaCollegeAdminRoute
                component={StudentList}
                exact
                layout={Layout}
                path={routeConstants.EVENT_STUDENT_LIST}
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
