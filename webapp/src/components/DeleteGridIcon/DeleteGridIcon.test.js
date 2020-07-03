import React from "react";
import { shallow } from "enzyme";

import DeleteGridIcon from "./DeleteGridIcon";

describe("Testing DeleteGridIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" should render when disabled is not passed in props.", () => {
    props = {
      id: "deleteIcon-id",
      userId: "1",
      value: "test",
      contactId: "1",
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<DeleteGridIcon {...props} />);
    expect(wrapper.find("#deleteIcon-id")).toHaveLength(1);
  });

  it(" should render when disabled is passed in props.", () => {
    props = {
      id: "deleteIcon-id",
      userId: "1",
      value: "test",
      contactId: "1",
      disabled: true
    };
    wrapper = shallow(<DeleteGridIcon {...props} />);
    expect(wrapper.find("#deleteIcon-id")).toHaveLength(1);
  });
});
