import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import DeleteEvent from "../DeleteEvent.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";

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

describe("Delete Event", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();
  const setYearData = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check Delete Event page for medha admin when props.showModal is set", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      showModal: true,
      id: 1,
      dataToDelete: { name: "ABC" },
      closeModal: jest.fn(),
      clearSelectedRow: jest.fn(),
      isMultiDelete: false,
      seletedUser: 1
    };

    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <Router>
          <DeleteEvent {...props} />
        </Router>
      </LoaderContext.Provider>
    );

    wrapper.unmount();
  });
});
