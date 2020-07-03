import React from "react";
import { shallow } from "enzyme";

import ViewDownloadIcon from "./ViewDownloadIcon";

describe("Testing ViewDownloadIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" shoould renders without crashing", () => {
    props = {
      id: "download-id",
      onClick: jest.fn(() => "onClick"),
      value: "test",
      title: "test"
    };
    wrapper = shallow(<ViewDownloadIcon {...props} />);
    expect(wrapper).toBeDefined();
  });
});
