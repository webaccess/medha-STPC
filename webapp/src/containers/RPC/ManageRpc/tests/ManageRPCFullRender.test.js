import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import ManageRpc from "../ManageRpc";
import LoaderContext from "../../../../context/LoaderContext";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as serviceProviders from "../../../../api/Axios";
import auth from "../../../../components/Auth";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as mockData from "../../../../mockData/mockData";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));
jest.mock("axios");
jest.mock("../../../../api/Axios");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("Manage RPC", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("test the component for initial render", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const ManageRpcSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockData.mockManageRPCData
          });
        });
      });

    const props = {
      location: {
        pathname: "/manage-rpc",
        search: "",
        hash: "",
        state: null,
        key: "wxxain"
      }
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageRpc {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    // /** This actually checks whether the post method is called with proper url and request body */
    expect(ManageRpcSpy.mock.calls).toEqual([
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS,
        {
          page: 1,
          pageSize: 10,
          _sort: "name:asc"
        }
      ]
    ]);

    // /** This actually checks whether the post method is called */
    expect(ManageRpcSpy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
