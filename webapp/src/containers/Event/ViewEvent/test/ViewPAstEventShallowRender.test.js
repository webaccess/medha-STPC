import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import ViewPastEvent from "../ViewPastEvent.js";
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

describe("Manage Past Event", () => {
  auth.setToken(studentUser.jwt, true);
  auth.setUserInfo(studentUser.user, true);
  let props = {
    location: {
      pathname: "/past-events",
      search: "",
      hash: "",
      key: "65lh3d"
    },
    mockPastEventData: mockStudentData.mockTempDataForPastEvent
  };
  let wrapper = shallow(<ViewPastEvent {...props} />);
  it("should check table events without filters", async () => {
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper
      .find("#ManageTableID")
      .props()
      .onSort({ selector: "title" }, "asc", 20, 2);
    wrapper.find("#ManageTableID").props().onGiveFeedback({ id: 1 });
  });
});
