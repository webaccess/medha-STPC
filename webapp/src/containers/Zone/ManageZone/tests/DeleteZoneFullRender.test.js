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

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("Delete Zone", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("test the component for initial render", () => {
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
    let wrapper = mount(
      <Router>
        <DeleteZone {...props} />
      </Router>
    );
  });
});
