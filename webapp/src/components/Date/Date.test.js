import React from "react";
import { shallow } from "enzyme";

import Date from "./Date";

describe("Testing Date Component", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" should render when props is passed.", () => {
    props = {
      id: "date-id",
      label: "date",
      name: "test date",
      placeholder: "placeholder",
      value: "test",
      onChange: jest.fn(() => "onClick")
    };
    wrapper = shallow(<Date {...props} />);
    expect(wrapper.find("#date-id")).toHaveLength(1);
  });
});
