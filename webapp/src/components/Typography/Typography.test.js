import React from "react";
import { shallow } from "enzyme";

import Header from "./Typography";
import Typography from "./Typography";

describe("Testing Header", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<Header {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders without crashing", () => {
    wrapper = shallow(<Typography {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing", () => {
    props = {
      variant: "contained"
    };
    wrapper = shallow(<Typography {...props} />);
    expect(wrapper.props().variant).toBe("contained");
  });

  it(" renders without crashing", () => {
    props = {};
    wrapper = shallow(<Typography {...props} />);
    expect(wrapper.props().variant).toBe("inherit");
  });
});
