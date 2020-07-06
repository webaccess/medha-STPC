import React from "react";
import { shallow } from "enzyme";

import UploadIcon from "./UploadIcon";

describe("Testing UploadIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<UploadIcon {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing", () => {
    props = {
      title: "Upload"
    };
    wrapper = shallow(<UploadIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe("Upload");
  });
});
