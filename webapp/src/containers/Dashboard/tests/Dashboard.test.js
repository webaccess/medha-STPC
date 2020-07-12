import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import Dashboard from "../Dashboard.js";
import auth from "../../../components/Auth";
import LoaderContext from "../../../context/LoaderContext";
import * as serviceProviders from "../../../api/Axios";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import * as medhaAdminUser from "../../../mockuser/MedhaAdmin.json";
import * as collegeAdminUser from "../../../mockuser/CollegeAdmin.json";
import * as StudentUser from "../../../mockuser/StudentUser.json";
import * as ZonalUser from "../../../mockuser/ZonalAdminUser.json";
import * as DepartmentAdmin from "../../../mockuser/DepartmentAdmin.json";
import * as RPCAdmin from "../../../mockuser/RPCAdmin.json";
import SetIndexContext from "../../../context/SetIndexContext.js";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../api/Axios");
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
  const setYearDataUseState = useStateMock.mockImplementation(
    (yearData = ["2018", "2019", "2020"]) => [yearData, setYearData]
  );
  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check Dashboard for medha admin", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Dashboard />
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    const getStatusOfDashboardSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: [
              {
                id: 1,
                status: "completed",
                created_at: "2020-07-08T21:00:00.080Z",
                updated_at: "2020-07-08T21:00:08.337Z"
              }
            ]
          });
        });
      });

    /** This actually checks whether the post method is called */
    expect(getStatusOfDashboardSpy).toBeCalled();

    // /** This actually checks whether the post method is called with proper url and request body */
    expect(getStatusOfDashboardSpy).toBeCalledWith(
      `${strapiApiConstants.STRAPI_DB_URL + "dashboard-histories"}`
    );

    // //wrapper.find("#year_id").at(0).simulate("change", jest.fn(), "2019");
    wrapper.find("#year_id").at(0).props().onChange(jest.fn(), "2019");
    wrapper.find("#regionDemo").at(0).props().onChange(jest.fn(), { id: 2 });
    wrapper.find("#zoneDemo").at(0).props().onChange(jest.fn(), { id: 2 });
    wrapper.find("#collegeDemo").at(0).props().onChange(jest.fn(), { id: 2 });

    wrapper.find("#month_id").at(0).props().onChange(jest.fn(), { id: 2 });

    wrapper.unmount();
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

    const getStatusOfDashboardSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: [
              {
                id: 1,
                status: "completed",
                created_at: "2020-07-07T19:00:00.106Z",
                updated_at: "2020-07-07T19:00:01.862Z"
              }
            ]
          });
        });
      });

    /** This actually checks whether the post method is called */
    expect(getStatusOfDashboardSpy).toBeCalled();

    // /** This actually checks whether the post method is called with proper url and request body */
    expect(getStatusOfDashboardSpy).toBeCalledWith(
      `${strapiApiConstants.STRAPI_DB_URL + "dashboard-histories"}`
    );
    wrapper.unmount();
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
    wrapper.unmount();
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
    wrapper.unmount();
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
    wrapper.unmount();
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
    wrapper.unmount();
  });
});
