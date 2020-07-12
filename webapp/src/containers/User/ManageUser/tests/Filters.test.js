import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import ManageUser from "../ManageUser.js";
import auth from "../../../../components/Auth";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";

React.useLayoutEffect = React.useEffect;

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Manage User", () => {
  const simulateChangeOnInput = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate("change", {
      target: { name: newNameValue, value: newValue },
      persist: jest.fn()
    });
    return wrapper.find(inputSelector);
  };

  const simulateChangeOnAutoInput = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate(
      "change",

      { newNameValue },
      { id: parseInt(newValue) }
    );
    return wrapper.find(inputSelector);
  };

  it("Should test filters", () => {
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

    const wrapper = shallow(<ManageUser {...props} />);

    /** Check contact number */
    const contactNumber = simulateChangeOnInput(
      wrapper,
      "#contactNumberID",
      "0123456789",
      "contact.phone_contains"
    );
    expect(contactNumber.props().value).toEqual("0123456789");

    /** Check auto complete */
    simulateChangeOnAutoInput(wrapper, "#role_filter", "1");
    simulateChangeOnAutoInput(wrapper, "#state_filter", "1");
    simulateChangeOnAutoInput(wrapper, "#zone_filter", "1");
    simulateChangeOnAutoInput(wrapper, "#rpc_filter", "1");
    simulateChangeOnAutoInput(wrapper, "#ipc_filter", "1");
  });
});
