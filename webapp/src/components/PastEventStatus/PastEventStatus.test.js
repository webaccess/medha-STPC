import React from "react";
import { shallow } from "enzyme";

import PastEventStatus from "./PastEventStatus";

describe("Testing PastEventStatus", () => {
  let props;
  let wrapper;

  beforeEach(() => {});
  it(" renders without crashing", () => {
    wrapper = shallow(<PastEventStatus {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders with style prop as true", () => {
    props = {
      id: "PastEvent-id",
      style: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<PastEventStatus {...props} />);
    const title = wrapper.find("#PastEvent-id");

    expect(title.props().style.color).toBe("green");
  });
  it(" renders with style prop as false", () => {
    props = {
      id: "PastEvent-id",
      style: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<PastEventStatus {...props} />);
    const title = wrapper.find("#PastEvent-id");
    expect(title.props().style.color).toBe("grey");
  });

  it("Renders with title props as true", () => {
    props = {
      id: "Block-id",
      style: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<PastEventStatus {...props} />);
    const title = wrapper.find("#pastEvent-id");
    expect(title.prop("title").props.children.props.children).toBe("Attended");
  });
  it("Renders with title props as false", () => {
    props = {
      id: "Block-id",
      style: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<PastEventStatus {...props} />);
    const title = wrapper.find("#pastEvent-id");
    expect(title.prop("title").props.children.props.children).toBe("Missed");
  });
});
