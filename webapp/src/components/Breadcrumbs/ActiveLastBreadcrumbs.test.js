import React from "react";
import { shallow } from "enzyme";

import ActiveLastBreadcrumbs from "./Breadcrumbs";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Testing BlockGridIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    props = {
      list: [
        { title: "Activity", href: "/manage-activity" },
        { title: "soft Skills 2 Batches", href: "/" }
      ],
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<ActiveLastBreadcrumbs {...props} />);
    expect(wrapper).toBeDefined();
  });
});
