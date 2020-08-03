import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import ManageUser from "../ManageUser.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as collegeAdminUser from "../../../../mockuser/CollegeAdmin.json";
import * as StudentUser from "../../../../mockuser/StudentUser.json";
import * as ZonalUser from "../../../../mockuser/ZonalAdminUser.json";
import * as DepartmentAdmin from "../../../../mockuser/DepartmentAdmin.json";
import * as RPCAdmin from "../../../../mockuser/RPCAdmin.json";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import axios from "axios";
import * as mockData from "../MockData/MockData";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("Dashboard", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();
  const setYearData = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check Manage User page for medha admin", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        fromeditUser: false,
        editedUserName: null,
        fromAddUser: false,
        addedUserName: null
      }
    };

    const getStatusOfDashboardSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockData.userData
          });
        });
      });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageUser {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getStatusOfDashboardSpy.mock.calls).toEqual([
      [
        process.env.REACT_APP_SERVER_URL + "crm-plugin/contact/get-individuals",
        {
          page: 1,
          pageSize: 10
        }
      ],
      [
        process.env.REACT_APP_SERVER_URL + "crm-plugin/states",
        {
          pageSize: -1
        }
      ]
    ]);

    /** This actually checks whether the post method is called */
    expect(getStatusOfDashboardSpy).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });
});
