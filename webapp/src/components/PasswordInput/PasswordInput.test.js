import React from "react";
import { shallow } from "enzyme";

import input from "./PasswordInput";
import TextField from "./PasswordInput";

describe("Testing PasswordInput", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<input {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders with props", () => {
    props = {
      id: "test",
      value: "testValue",
      autoFocus: true,
      variant: "outlined",
      error: "Field is empty"
    };
    wrapper = shallow(<TextField {...props} />);
    const title = wrapper.find("#test");
    expect(title.props().value).toBe("testValue");
    expect(title.props().autoFocus).toBe(true);
    expect(title.props().variant).toBe("outlined");
    expect(title.props().error).toBe("Field is empty");
  });

  it(" renders with props", () => {
    props = {
      id: "test",
      value: "testValue",
      autoFocus: false
    };
    wrapper = shallow(<TextField {...props} />);
    const title = wrapper.find("#test");
    expect(title.props().value).toBe("testValue");
    expect(title.props().autoFocus).toBe(false);
    expect(title.props().variant).toBe("standard");
    expect(title.props().error).toBe(false);
  });
});
