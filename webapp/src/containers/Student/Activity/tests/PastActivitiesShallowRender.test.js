import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import PastActivities from "../PastActivities.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as collegeUser from "../../../../mockuser/CollegeAdmin.json";
import * as studentUser from "../../../../mockuser/StudentUser.json";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as mockStudentData from "../../../../mockData/mockStudentData";
import SetIndexContext from "../../../../context/SetIndexContext.js";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Manage Past activity", () => {
  auth.setToken(studentUser.jwt, true);
  auth.setUserInfo(studentUser.user, true);
  let props = {
    location: {
      pathname: "/past-activities",
      search: "",
      hash: "",
      key: "rf0jxx"
    },
    mockPastActivityData: mockStudentData.mockTempDataForPastActivity
  };

  let wrapper = shallow(<PastActivities {...props} />);
  it("Should check table data without filters", async () => {
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
  });
});
