import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import ViewDocument from "../ViewDocument.js";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants";
import * as studentUser from "../../../../mockuser/StudentUser.json";
import * as mockStudentData from "../../../../mockData/mockStudentData";
import * as collegeAdminUser from "../../../../mockuser/CollegeAdmin.json";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("View Document", () => {
  it("Simulate changes after add document", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);

    const props = {
      location: {
        pathname: "/view-documents",
        fromAddDocument: true,
        isDataAdded: true,
        addResponseMessage: "",
        addedData: {},
        search: "",
        hash: "",
        key: "pimfzk"
      }
    };
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    shallow(<ViewDocument {...props} />);
  });

  it("Simulate table and filters when search is active", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    const filterGetSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.ViewDocumentResponse
          });
        });
      });

    const props = {
      location: {
        pathname: "/view-documents",
        search: "",
        hash: "",
        key: "pimfzk"
      }
    };
    /** Simulating fiter fields */
    const wrapper = shallow(<ViewDocument {...props} />);
    wrapper.find("#name").simulate("change", {
      target: {
        value: "test"
      },
      persist: jest.fn()
    });
    expect(wrapper.find("#name").props().value).toEqual("test");
    wrapper.find("#submitFilter").simulate("click", { persist: jest.fn() });
    expect(filterGetSpy).toBeCalled();
    wrapper.find("#cancelFilter").simulate("click", {});
  });
});
