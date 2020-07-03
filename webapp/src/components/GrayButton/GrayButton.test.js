import React from "react";
import { shallow } from "enzyme";

import GrayButton from "./GrayButton";

describe("Testing GrayButton", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders gray button when 'to' props is undefined", () => {
    props = {
      type: "submit",
      color: "red",
      variant: "fullWidth"
    };
    wrapper = shallow(<GrayButton {...props} />);
    expect(wrapper).toHaveLength(1);
  });

  it(" renders gray button when 'to' props is undefined and type color variant is not passed", () => {
    props = {};
    wrapper = shallow(<GrayButton {...props} />);
    expect(wrapper).toHaveLength(1);
  });

  it(" renders gray button when 'to' prop is passed", () => {
    props = {
      to: "/auth/login",
      type: "submit",
      color: "red",
      variant: "fullWidth"
    };
    wrapper = shallow(<GrayButton {...props} />);
    expect(wrapper).toHaveLength(1);
  });

  it(" renders gray button when 'to' prop is passed and type color variant is not passed", () => {
    props = {
      to: "/auth/login"
    };
    wrapper = shallow(<GrayButton {...props} />);
    expect(wrapper).toHaveLength(1);
  });
});
