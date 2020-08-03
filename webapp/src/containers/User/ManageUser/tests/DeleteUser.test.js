import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import DeleteUser from "../DeleteUser";
import * as serviceProviders from "../../../../api/Axios";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Delete User", () => {
  it("Delete props", () => {
    let props = {
      clearSelectedRow: jest.fn(),
      dataToDelete: {
        id: "51",
        name: "7977069203"
      },
      showModal: true
    };
    let wrapper = shallow(<DeleteUser {...props} />);
    const deleteSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [] }
          });
        });
      });
    wrapper.find("#submitDeleteUser").simulate("click", {
      preventDefault: jest.fn(),
      persist: jest.fn()
    });
    console.log("DeleteUserApi", deleteSpy.mock.calls);
    expect(deleteSpy).toBeCalled();
  });
});
