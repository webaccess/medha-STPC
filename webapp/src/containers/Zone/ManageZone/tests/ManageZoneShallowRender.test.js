import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import ManageZone from "../ManageZone.js";
import { BrowserRouter as Router } from "react-router-dom";
import LoaderContext from "../../../../context/LoaderContext";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as serviceProviders from "../../../../api/Axios";
import auth from "../../../../components/Auth";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as mockData from "../../../../mockData/mockData";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));
jest.mock("axios");
jest.mock("../../../../api/Axios");

describe("Manage Zone shallow render", () => {
  it("test the component for initial render", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: {
        pathname: "/manage-zones",
        search: "",
        hash: "",
        state: null,
        key: "r57y9u"
      },
      testingZoneData: mockData.manageZoneData.result
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<ManageZone {...props} />);
  });
});
