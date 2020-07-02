import React from "react";
import { shallow, mount } from "enzyme";
import LogIn from "./Login.js";
import axios from "axios";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

const originalConsoleError = console.error;

beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

const simulateChangeOnInput = (wrapper, inputSelector, newValue, inputName) => {
  const input = wrapper.find(inputSelector);

  input.simulate("change", {
    persist: jest.fn(),
    target: { name: inputName, value: newValue }
  });
  return wrapper.find(inputSelector);
};

describe("Login", () => {
  it("should match the snapshot", () => {
    const wrapper = shallow(<LogIn />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Should check contact number has value", () => {
    const wrapper = shallow(<LogIn />);
    const contactInput = simulateChangeOnInput(
      wrapper,
      "#contactnumber",
      "9029161582",
      "identifier"
    );

    expect(contactInput.props().value).toBe("9029161582");
  });

  it("Should check password has value", () => {
    const wrapper = shallow(<LogIn />);
    const contactInput = simulateChangeOnInput(
      wrapper,
      "#password",
      "admin1234",
      "password"
    );

    expect(contactInput.props().value).toBe("admin1234");
  });

  it("Should check post request for Sign In", async () => {
    const wrapper = shallow(<LogIn />);
    const data = {
      jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    };
    const postSpy = jest.spyOn(axios, "post").mockImplementation(() => {
      return new Promise(resolve => {
        return resolve(data);
      });
    });

    /**Setting the identifier and password */
    simulateChangeOnInput(
      wrapper,
      "#contactnumber",
      "9029161582",
      "identifier"
    );
    simulateChangeOnInput(wrapper, "#password", "admin1234", "password");

    /** Mock data which is expected after setting username and password */
    const mockDataRequest = {
      identifier: "9029161582",
      password: "admin1234"
    };

    /** This simulates the Onsubmit event */
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });

    /** This actually checks whether the post method is called */
    expect(postSpy).toBeCalled();

    /** This actually checks whether the post method is called with proper url and request body */
    expect(postSpy).toBeCalledWith(
      `${
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_LOGIN_PATH
      }`,
      expect.objectContaining(mockDataRequest)
    );

    /** postSpy.mock.results.pop().value this gets the promise of the axios request */
    const postPromise = postSpy.mock.results.pop().value;

    /** Check promise */
    return postPromise.then(postResponse => {
      expect(postResponse).toBe(data);
    });
  });
});
