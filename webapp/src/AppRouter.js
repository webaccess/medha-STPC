import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { NotFoundPage, Logout } from "./components";
import * as routeConstants from "./constants/RouteConstants";
import {
  LoginRoute,
  ForgotPasswordRoute,
  RouteWithLayout,
  PrivateRoute,
  DashBoardComponent,
  MedhaCollegeAdminRoute,
  MedhaAdminRoute,
  CollegeAdminRoute,
  EditEventRoute,
  EditCollegeRoute,
  EditStateRoute,
  EditZoneRoute,
  EditRpcRoute,
  EditUserRoute,
  EditEducation,
  RouteWithTabLayout,
  EditAcademicHistoryRoute,
  EditActivityBatchRoute
} from "./authroute";

/** General */
import Dashboard from "./containers/Dashboard/Dashboard";
import Layout from "./hoc/Layout/Layout";
import ChangePassword from "./containers/AuthPage/ChangePassword/ChangePassword";

/** College routes */
import AddEditCollege from "./containers/College/AddEditCollege/AddEditCollege";
import ManageCollege from "./containers/College/ManageCollege/ManageCollege";
import ViewCollege from "./containers/College/ManageCollege/ViewCollege";

/** College route */
import AddUser from "./containers/User/AddEditUser/AddEditUser";
import ManageUser from "./containers/User/ManageUser/ManageUser";
import ViewUser from "./containers/User/ManageUser/ViewUser";

/** RPC */
import AddEditRpc from "./containers/RPC/AddEditRpc/AddEditRpc";
import ManageRpc from "./containers/RPC/ManageRpc/ManageRpc";

/** State */
import AddEditState from "./containers/State/AddEditState/AddEditState";
import ManageState from "./containers/State/ManageState/ManageState";

/** Zone */
import AddZone from "./containers/Zone/AddEditZone/AddEditZone";
import ManageZone from "./containers/Zone/ManageZone/ManageZone";

/** Events */
import ManageEvent from "./containers/Event/ManageEvent/ManageEvent";
import AddEditEvent from "./containers/Event/AddEditEvent/AddEditEvent";
import StudentList from "./containers/Event/ManageEvent/EventStudentList";
import ViewEvent from "./containers/Event/ViewEvent/ViewEvent";
import EligibleEvents from "./containers/Event/EligibleEvents/EligibleEvents";
import AddStudentToRecruitmentDrive from "./containers/Event/ManageEvent/AddStudentToRecruitmentDrive";
import ViewPastEvent from "./containers/Event/ViewEvent/ViewPastEvent";

/** OTP */
import RequestOtp from "./containers/OTP/Requestotp";
import VerifyOtp from "./containers/OTP/Verifyotp";

/** Registration */
import Registered from "./containers/Registration/Registered.js";
import RegistrationRoute from "./containers/Registration/RegistrationRoute";
import AddEditStudent from "./containers/Registration/AddEditStudent";

/** RequiredConformation */
import RequiredConformation from "./components/RequiredConformation/RequiredConformation.js";
import RequiredErrorPage from "./components/RequiredErrorPage/RequiredErrorPage.js";

/** Student */
import StudentProfile from "./containers/Student/StudentProfile";
import ViewEducation from "./containers/Student/Education/ViewEducation";
import AddEducation from "./containers/Student/Education/AddEditEducation";
import ViewDocument from "./containers/Student/Document/ViewDocument";
import AddDocument from "./containers/Student/Document/AddEditDocument";
import ManageStudents from "./containers/Student/ManageStudentCollegeAdmin/ManageStudent/ManageStudents";
import ViewAcademicHistory from "./containers/Student/AcademicHistory/ViewAcademicHistory";
import AddEditAcademicHistory from "./containers/Student/AcademicHistory/AddEditAcademicHistory";
import AddEditStudentForCollegeAdmin from "./containers/Student/ManageStudentCollegeAdmin/AddEditStudentForCollegeAdmin/AddEditStudentForCollegeAdmin";
import ViewPastActivities from "./containers/Student/Activity/PastActivities";

/** Activity */
import ViewActivity from "./containers/Activity/ViewActivity.js";
import AddEditActivity from "./containers/Activity/AddEditActivity";
import ActivityRoute from "./containers/Activity/ActivityRoute.js";
import ActivityDetails from "./containers/Activity/ActivityDetails";
import EligibleActivity from "./containers/Activity/EligibleActivity";
import ViewActivityBatches from "./containers/Activity/ActivityBatch/ViewActivityBatches";
import AddEditActivityBatch from "./containers/Activity/ActivityBatch/AddEditActivityBatch";
import PastActivitiesDetails from "./containers/Activity/PastActivitiesDetails";

/** Import */
import StudentsImport from "./containers/Import/StudentsImport/StudentsImport";

/** FeedBack */
import AddEditFeedBack from "./containers/Feedback/AddFeedback/AddFeedback";

const AppRouter = props => {
  return (
    <div>
      <Switch>
        <DashBoardComponent
          path={routeConstants.DEFAULT_URL}
          component={Dashboard}
          layout={Layout}
          exact
        />
        <PrivateRoute
          path={routeConstants.DASHBOARD_URL}
          component={Dashboard}
          layout={Layout}
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
        <RequiredErrorPage path={routeConstants.REQUIRED_ERROR_PAGE} exact />
        <Route path={routeConstants.LOGOUT_URL} component={Logout} exact />
        <Registered path={routeConstants.REGISTERED} layout={Layout} exact />

        {/** Change Password*/}
        <RouteWithLayout
          component={ChangePassword}
          exact
          layout={Layout}
          path={routeConstants.CHANGE_PASSWORD}
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
          title="Edit Profile"
        />

        <RequestOtp path={routeConstants.REQUEST_OTP} layout={Layout} exact />

        <VerifyOtp path={routeConstants.VERIFY_OTP} layout={Layout} exact />

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
          title="Profile"
        />
        {/**View Past Event */}
        <RouteWithTabLayout
          component={ViewPastEvent}
          exact
          layout={Layout}
          path={routeConstants.VIEW_PAST_EVENTS}
          title="Event History"
        />

        {/**Education */}
        <RouteWithTabLayout
          component={ViewEducation}
          exact
          layout={Layout}
          path={routeConstants.VIEW_EDUCATION}
          title="View Education"
        />

        <RouteWithTabLayout
          component={AddEducation}
          exact
          layout={Layout}
          path={routeConstants.ADD_EDUCATION}
          title="Add Education"
        />

        <RouteWithTabLayout
          component={EditEducation}
          exact
          layout={Layout}
          path={routeConstants.EDIT_EDUCATION}
          title="Edit Education"
        />
        {/**Student document */}
        <RouteWithTabLayout
          component={ViewDocument}
          exact
          layout={Layout}
          path={routeConstants.VIEW_DOCUMENTS}
          title="View Document"
        />

        <RouteWithTabLayout
          component={AddDocument}
          exact
          layout={Layout}
          path={routeConstants.ADD_DOCUMENTS}
          title="Add Document"
        />

        <RouteWithTabLayout
          component={ViewPastActivities}
          exact
          layout={Layout}
          path={routeConstants.VIEW_PAST_ACTIVITIES}
          title="Activity History"
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

        <RouteWithLayout
          component={PastActivitiesDetails}
          exact
          layout={Layout}
          path={routeConstants.PAST_ACTIVITY_DETAILS}
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
          title="View Academic History"
        />

        <RouteWithTabLayout
          component={AddEditAcademicHistory}
          exact
          layout={Layout}
          path={routeConstants.ADD_ACADEMIC_HISTORY}
          title="Add Academic History"
        />

        <RouteWithTabLayout
          component={EditAcademicHistoryRoute}
          exact
          layout={Layout}
          path={routeConstants.EDIT_ACADEMIC_HISTORY}
          title="Edit Academic History"
        />

        {/** User */}
        {/** Add User **/}
        <MedhaAdminRoute
          component={AddUser}
          exact
          layout={Layout}
          path={routeConstants.ADD_USER}
        />
        {/** View User */}
        <MedhaAdminRoute
          component={ManageUser}
          exact
          layout={Layout}
          path={routeConstants.MANAGE_USER}
        />
        {/** Edit User Route*/}
        <MedhaAdminRoute
          component={EditUserRoute}
          exact
          layout={Layout}
          path={routeConstants.EDIT_USER}
        />
        {/** View User Data*/}
        <MedhaAdminRoute
          component={ViewUser}
          exact
          layout={Layout}
          path={routeConstants.VIEW_USER}
        />
        {/** State */}
        {/** Add Edit State */}
        <MedhaAdminRoute
          component={AddEditState}
          exact
          layout={Layout}
          path={routeConstants.ADD_STATES}
        />
        {/** Edit State Route */}
        <MedhaAdminRoute
          component={EditStateRoute}
          exact
          layout={Layout}
          path={routeConstants.EDIT_STATE}
        />
        <MedhaAdminRoute
          component={ManageState}
          exact
          layout={Layout}
          path={routeConstants.MANAGE_STATES}
        />
        {/** Rpc */}
        <MedhaAdminRoute
          component={AddEditRpc}
          exact
          layout={Layout}
          path={routeConstants.ADD_RPC}
        />
        <MedhaAdminRoute
          component={ManageRpc}
          exact
          layout={Layout}
          path={routeConstants.MANAGE_RPC}
        />
        <MedhaAdminRoute
          component={EditRpcRoute}
          exact
          layout={Layout}
          path={routeConstants.EDIT_RPC}
        />

        {/** Zone */}
        <MedhaAdminRoute
          component={AddZone}
          exact
          layout={Layout}
          path={routeConstants.ADD_ZONES}
        />
        <MedhaAdminRoute
          component={ManageZone}
          exact
          layout={Layout}
          path={routeConstants.MANAGE_ZONES}
        />
        <MedhaAdminRoute
          component={EditZoneRoute}
          exact
          layout={Layout}
          path={routeConstants.EDIT_ZONES}
        />

        {/** College */}
        {/** Add College */}
        <MedhaCollegeAdminRoute
          component={ViewCollege}
          exact
          layout={Layout}
          path={routeConstants.VIEW_COLLEGE}
        />
        <MedhaCollegeAdminRoute
          component={AddEditCollege}
          exact
          layout={Layout}
          path={routeConstants.ADD_COLLEGE}
        />
        {/** Edit College Route */}
        <MedhaCollegeAdminRoute
          component={EditCollegeRoute}
          exact
          layout={Layout}
          path={routeConstants.EDIT_COLLEGE}
        />
        {/** View College */}
        <MedhaAdminRoute
          component={ManageCollege}
          exact
          layout={Layout}
          path={routeConstants.MANAGE_COLLEGE}
        />
        {/** Manage Student */}
        <CollegeAdminRoute
          component={ManageStudents}
          exact
          layout={Layout}
          path={routeConstants.MANAGE_STUDENT}
        />
        {/** Event */}
        <MedhaCollegeAdminRoute
          component={ManageEvent}
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
        <MedhaCollegeAdminRoute
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
        <MedhaCollegeAdminRoute
          component={EditEventRoute}
          exact
          layout={Layout}
          path={routeConstants.EDIT_EVENT}
        />
        {/** Event Student List Route */}
        <MedhaCollegeAdminRoute
          component={StudentList}
          exact
          layout={Layout}
          path={routeConstants.EVENT_STUDENT_LIST}
        />
        {/**View Student Profile  */}

        <MedhaCollegeAdminRoute
          component={StudentProfile}
          exact
          layout={Layout}
          path={routeConstants.VIEW_STUDENT_PROFILE}
        />

        {/** FeedBack  */}
        <MedhaCollegeAdminRoute
          component={AddEditFeedBack}
          exact
          layout={Layout}
          path={routeConstants.ADD_FEEDBACK}
        />

        <CollegeAdminRoute
          component={AddEditStudentForCollegeAdmin}
          exact
          layout={Layout}
          path={routeConstants.ADD_STUDENT_FROM_COLLEGE_ADMIN}
        />
        <CollegeAdminRoute
          component={AddEditStudentForCollegeAdmin}
          exact
          layout={Layout}
          path={routeConstants.EDIT_STUDENT_FROM_COLLEGE_ADMIN}
        />
        {/** Add student to recruitment drive */}
        <CollegeAdminRoute
          component={AddStudentToRecruitmentDrive}
          exact
          layout={Layout}
          path={routeConstants.ADD_STUDENT_DRIVE}
        />
        {/** Import Students */}
        <CollegeAdminRoute
          component={StudentsImport}
          exact
          layout={Layout}
          path={routeConstants.IMPORT_STUDENTS}
        />

        {/* Activities */}
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
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </div>
  );
};
export default AppRouter;
