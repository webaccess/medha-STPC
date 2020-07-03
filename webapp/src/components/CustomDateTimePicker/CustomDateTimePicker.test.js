import React from "react";
import { shallow } from "enzyme";

import CustomDateTimePicker from "./CustomDateTimePicker";

describe("Testing CustomDateTimePicker Component", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" should render when props is passed.", () => {
    props = {
      id: "date-id",
      label: "date",
      placeholder: "placeholder",
      value: "test",
      helperText: "test",
      onChange: jest.fn(() => "onClick")
    };
    wrapper = shallow(<CustomDateTimePicker {...props} />);
    expect(wrapper.find("#date-id")).toHaveLength(1);
  });
});
