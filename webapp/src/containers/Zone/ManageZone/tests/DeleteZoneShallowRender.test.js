import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import DeleteZone from "../DeleteZone.js";
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

describe("Delete Zone", () => {
  it("test the component for initial render with single delete", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);

    const props = {
      showModal: true,
      id: "5",
      isMultiDelete: false,
      dataToDelete: {
        id: "5",
        name: "test"
      },
      modalClose: jest.fn(),
      clearSelectedRow: jest.fn(),
      closeModal: jest.fn()
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<DeleteZone {...props} />);

    const deleteSpy = jest
      .spyOn(serviceProviders, "serviceProviderForDeleteRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [] }
          });
        });
      });
    const checkIfZoneCanBeDeletedSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [] }
          });
        });
      });

    wrapper.find("#submitDeleteZone").simulate("click", {
      preventDefault: jest.fn(),
      persist: jest.fn()
    });

    expect(checkIfZoneCanBeDeletedSpy).toBeCalled();
  });

  it("test the component for initial render with single delete and it should give out error", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);

    const props = {
      showModal: true,
      id: "5",
      isMultiDelete: false,
      dataToDelete: {
        id: "5",
        name: "test"
      },
      modalClose: jest.fn(),
      clearSelectedRow: jest.fn(),
      closeModal: jest.fn()
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<DeleteZone {...props} />);

    const checkIfZoneCanBeDeletedSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: {
              result: [
                {
                  id: 1
                }
              ]
            }
          });
        });
      });

    wrapper.find("#submitDeleteZone").simulate("click", {
      preventDefault: jest.fn(),
      persist: jest.fn()
    });

    expect(checkIfZoneCanBeDeletedSpy).toBeCalled();
  });

  it("test the component for initial render with multi delete", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);

    const props = {
      showModal: true,
      id: [2, 3, 4, 1],
      isMultiDelete: true,
      dataToDelete: {},
      modalClose: jest.fn(),
      clearSelectedRow: jest.fn(),
      closeModal: jest.fn()
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<DeleteZone {...props} />);

    const checkIfZoneCanBeDeletedSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [] }
          });
        });
      });

    const deleteSpy = jest
      .spyOn(serviceProviders, "serviceProviderForAllDeleteRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [] }
          });
        });
      });

    wrapper.find("#submitDeleteZone").simulate("click", {
      preventDefault: jest.fn(),
      persist: jest.fn()
    });
    expect(checkIfZoneCanBeDeletedSpy).toBeCalled();
  });

  it("test the component for initial render with multi delete and the data should not get deleted", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);

    const props = {
      showModal: true,
      id: [2, 3, 4, 1],
      isMultiDelete: true,
      dataToDelete: {},
      modalClose: jest.fn(),
      clearSelectedRow: jest.fn(),
      closeModal: jest.fn()
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<DeleteZone {...props} />);

    const checkIfZoneCanBeDeletedSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [{ id: 1 }] }
          });
        });
      });

    wrapper.find("#submitDeleteZone").simulate("click", {
      preventDefault: jest.fn(),
      persist: jest.fn()
    });

    expect(checkIfZoneCanBeDeletedSpy).toBeCalled();
  });
});
