import React, { useContext, useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import Dashboard from "./Dashboard.js";
import SetIndexContext, {
  useSetIndexContext
} from "../../context/SetIndexContext";
import auth from "../../components/Auth";
import LoaderContext from "../../context/LoaderContext";
import * as genericConstants from "../../constants/GenericConstants";
import * as routeConstants from "../../constants/RouteConstants";
import * as roleConstants from "../../constants/RoleConstants";
import * as serviceProvider from "../../api/Axios";
import axios from "axios";
import * as serviceProviders from "../../api/Axios";
import * as strapiApiConstants from "../../constants/StrapiApiConstants";
import * as medhaAdminUser from "../../mockuser/MedhaAdmin.json";
import * as collegeAdminUser from "../../mockuser/CollegeAdmin.json";
import * as StudentUser from "../../mockuser/StudentUser.json";
import * as ZonalUser from "../../mockuser/ZonalAdminUser.json";
import * as DepartmentAdmin from "../../mockuser/DepartmentAdmin.json";
import * as RPCAdmin from "../../mockuser/RPCAdmin.json";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../api/Axios");
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
  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });
  it("Should check Dashboard for medha admin", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Dashboard />
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
  });

  it("Should check Dashboard for College admin", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);

    /** Mount component */
    const wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Dashboard />
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** Mock Implementation of getStatusOfDashboard() */
    // let dashboardStatusURL = `${
    //   strapiApiConstants.STRAPI_DB_URL + "dashboard-histories"
    // }`;
    // jest.mock("../../api/Axios", () => ({
    //   serviceProviderForGetRequest: jest
    //     .fn()
    //     .mockImplementation(dashboardStatusURL => {
    //       Promise.resolve({
    //         data: [
    //           {
    //             id: 1,
    //             status: "completed",
    //             created_at: "2020-07-07T19:00:00.106Z",
    //             updated_at: "2020-07-07T19:00:01.862Z"
    //           }
    //         ]
    //       });
    //     })
    // }));
    // const getStatusOfDashboardSpy = jest
    //   .spyOn(axios, "get")
    //   .mockImplementation(() => {
    //     return new Promise(resolve => {
    //       return resolve({
    //         data: [
    //           {
    //             id: 1,
    //             status: "completed",
    //             created_at: "2020-07-07T19:00:00.106Z",
    //             updated_at: "2020-07-07T19:00:01.862Z"
    //           }
    //         ]
    //       });
    //     });
    //   });

    // /** This actually checks whether the post method is called */
    // expect(getStatusOfDashboardSpy).toBeCalled();

    // /** This actually checks whether the post method is called with proper url and request body */
    // expect(getStatusOfDashboardSpy).toBeCalledWith(
    //   `${strapiApiConstants.STRAPI_DB_URL + "dashboard-histories"}`
    // );
  });

  it("Should check Dashboard for RPC admin", async () => {
    auth.setToken(RPCAdmin.jwt, true);
    auth.setUserInfo(RPCAdmin.user, true);
    const wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Dashboard />
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
  });

  it("Should check Dashboard for Department", async () => {
    auth.setToken(DepartmentAdmin.jwt, true);
    auth.setUserInfo(DepartmentAdmin.user, true);
    const wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Dashboard />
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
  });

  it("Should check Dashboard for Zonal Admin", async () => {
    auth.setToken(ZonalUser.jwt, true);
    auth.setUserInfo(ZonalUser.user, true);
    const wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Dashboard />
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
  });

  it("Should check Dashboard for Student", async () => {
    auth.setToken(StudentUser.jwt, true);
    auth.setUserInfo(StudentUser.user, true);
    const wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Dashboard />
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
  });
});
