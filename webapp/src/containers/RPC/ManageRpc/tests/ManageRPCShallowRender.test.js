import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import ManageRpc from "../ManageRpc.js";
import { BrowserRouter as Router } from "react-router-dom";
import LoaderContext from "../../../../context/LoaderContext";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as serviceProviders from "../../../../api/Axios";
import auth from "../../../../components/Auth";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as mockData from "../../../../mockData/mockData";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));
jest.mock("axios");
jest.mock("../../../../api/Axios");

describe("Manage RPC shallow render", () => {
  it("test the component for initial render with data to show", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: {
        pathname: "/manage-rpc",
        search: "",
        hash: "",
        state: null,
        key: "wxxain"
      },
      testingRPCData: mockData.mockTempDataForRPC
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<ManageRpc {...props} />);
    /** Simulating table fields */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper
      .find("#ManageTableID")
      .props()
      .editEvent({
        persist: jest.fn(),
        target: {
          id: 1
        }
      });
    wrapper
      .find("#ManageTableID")
      .props()
      .deleteEvent({
        target: {
          id: 1,
          getAttribute: jest.fn()
        }
      });
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper
      .find("#ManageTableID")
      .props()
      .onSort({ selector: "state" }, "asc", 20, 2);

    wrapper
      .find("#ManageTableID")
      .props()
      .onSelectedRowsChange({
        selectedCount: 1,
        selectedRows: [
          { id: 2, name: "Bundelkhand Zone - Jhansi", state: "Uttar Pradesh" }
        ]
      });

    /**Simulating buttons for deleteing multiple users and add zones */
    wrapper.find("#deleteMulUsers").simulate("click", {});
  });

  it("should simulate filter", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: {
        pathname: "/manage-rpc",
        search: "",
        hash: "",
        state: null,
        key: "wxxain"
      },
      testingRPCData: mockData.mockTempDataForRPC
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<ManageRpc {...props} />);

    wrapper.find("#name").simulate("change", {
      target: {
        value: "test"
      }
    });
    const filterGetSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockData.mockFilterResultRPCData
          });
        });
      });
    expect(wrapper.find("#name").props().value).toEqual("test");
    wrapper.find("#submitFilter").simulate("click", { persist: jest.fn() });
    expect(filterGetSpy).toBeCalled();
    wrapper.find("#cancelFilter").simulate("click", {});
  });

  it("should simulate filter and then rows change and page change", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: {
        pathname: "/manage-rpc",
        search: "",
        hash: "",
        state: null,
        key: "wxxain"
      },
      testingRPCData: mockData.mockTempDataForRPC
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<ManageRpc {...props} />);

    wrapper.find("#name").simulate("change", {
      target: {
        value: "test"
      }
    });
    jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockData.mockFilterResultRPCData
          });
        });
      });
    expect(wrapper.find("#name").props().value).toEqual("test");
    wrapper.find("#submitFilter").simulate("click", { persist: jest.fn() });
    wrapper
      .find("#ManageTableID")
      .props()
      .onSort({ selector: "name" }, "asc", 20, 2);
    /** Simulating table fields */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper
      .find("#ManageTableID")
      .props()
      .editEvent({
        persist: jest.fn(),
        target: {
          id: 1
        }
      });
    wrapper
      .find("#ManageTableID")
      .props()
      .deleteEvent({
        target: {
          id: 1,
          getAttribute: jest.fn()
        }
      });
    wrapper.find("#ManageTableID").props().onChangePage(2);
  });

  it("should render component after rpc has been added", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: mockData.mockLocationDataForAddRPC,
      testingRPCData: mockData.mockTempDataForRPC
    };

    shallow(<ManageRpc {...props} />);
  });

  it("should render component after rpc has been edited", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: mockData.mockLocationDataForEditRPC,
      testingRPCData: mockData.mockTempDataForRPC
    };

    shallow(<ManageRpc {...props} />);
  });
});
