import React, { useState as useStateMock } from "react";
import ViewStates from "./ManageState";
import { mount, shallow } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../components/Auth";
import LoaderContext from "../../../context/LoaderContext";
import * as serviceProviders from "../../../api/Axios";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import * as medhaAdminUser from "../../../mockuser/MedhaAdmin.json";
import SetIndexContext from "../../../context/SetIndexContext.js";
import axios from "axios";

jest.mock("axios");
jest.mock("../../../api/Axios");

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("testing for zone", () => {
  const simulateChangeOnInput = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate("change", {
      persist: jest.fn(),
      target: { name: newNameValue, value: newValue }
    });
    return wrapper.find(inputSelector);
  };

  it("It has an input field", () => {
    const wrapper = shallow(<ViewStates />);
    const input = wrapper.find("#name");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input", () => {
    const abc = shallow(<ViewStates />);

    const updatedNameInput = simulateChangeOnInput(abc, "#name", "maharashtra");
    expect(updatedNameInput.props().value).toEqual("maharashtra");
  });

  it("Testing full monunt and basic apis of useeffect", () => {
    const setIndex = jest.fn();
    const setLoaderStatus = jest.fn();
    // useStateMock.mockImplementation(init => [init, setIndex]);
    // useStateMock.mockImplementation(init => [init, setLoaderStatus]);
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        fromEditState: false,
        stateDataEdited: null,
        fromAddState: false,
        addedStateData: null
      }
    };

    const getManageUserSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: {
              result: [
                {
                  id: 1,
                  name: "Uttar Pradesh",
                  is_active: true,
                  abbreviation: "UP",
                  identifier: "",
                  country: {
                    id: 1,
                    name: "India",
                    is_active: true,
                    abbreviation: "IN",
                    identifier: "IN",
                    created_at: "2020-06-25T06:43:49.636Z",
                    updated_at: "2020-06-25T06:43:49.636Z"
                  },
                  created_at: "2020-06-25T06:43:49.649Z",
                  updated_at: "2020-06-25T06:43:49.649Z"
                }
              ],
              page: 1,
              pageSize: 10,
              rowCount: 1,
              pageCount: 1
            }
          });
        });
      });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ViewStates {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getManageUserSpy.mock.calls).toEqual([
      [
        process.env.REACT_APP_SERVER_URL + "crm-plugin/states",
        {
          _sort: "name:ASC",
          page: 1,
          pageSize: 10
        }
      ]
    ]);

    /** This actually checks whether the post method is called */
    expect(getManageUserSpy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
