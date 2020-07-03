import React from "react";
import { shallow } from "enzyme";

import GreenButton from "./GreenButton";

describe("Testing GreenButton", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders GreenButton when 'greenButtonChecker' props is passed", () => {
    props = {
      greenButtonChecker: true,
      type: "submit",
      color: "red",
      variant: "fullWidth",
      className: "test"
    };
    wrapper = shallow(<GreenButton {...props} />);
    expect(wrapper).toHaveLength(1);
  });

  it(" renders GreenButton when 'greenButtonChecker' props is passed but type color variant is not passed", () => {
    props = { greenButtonChecker: true };
    wrapper = shallow(<GreenButton {...props} />);
    expect(wrapper).toHaveLength(1);
  });

  it(" renders GreenButton when 'greenButtonChecker' props is false", () => {
    props = {
      greenButtonChecker: false,
      type: "submit",
      color: "red",
      variant: "fullWidth",
      className: "test"
    };
    wrapper = shallow(<GreenButton {...props} />);
    expect(wrapper).toHaveLength(1);
  });

  it(" renders GreenButton when 'greenButtonChecker' props is false but type color variant is not passed", () => {
    props = { greenButtonChecker: false };
    wrapper = shallow(<GreenButton {...props} />);
    expect(wrapper).toHaveLength(1);
  });
});
