import React from "react";
import { shallow } from "enzyme";

import Table from "./Table";

describe("Testing Table", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<Table {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders with pagination and selectedRows", () => {
    props = {
      pagination: false,
      selectableRows: false
    };
    wrapper = shallow(<Table {...props} />);
    expect(wrapper.props().children.props.pagination).toBe(false);
    expect(wrapper.props().children.props.selectableRows).toBe(false);
  });
});
