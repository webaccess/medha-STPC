import React from "react";
import { shallow } from "enzyme";
import AddStudentToRecruitmentDrive from "../AddStudentToRecruitmentDrive.js";
import auth from "../../../../components/Auth";
import * as collegeAdminUser from "../../../../mockuser/CollegeAdmin.json";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Manage Event", () => {
  it("Should check the filters", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let props = {
      location: {
        fromeditEvent: false,
        editedEventData: null,
        fromAddEvent: false,
        addedEventData: null
      },
      testDataToShow: [
        {
          id: 6,
          name: "First Last",
          phone: "1552443447",
          phone_other: null,
          email: "1552443447@gmail.com",
          email_other: null,
          address_1: "UP",
          address_2: null,
          city: null,
          pincode: null,
          contact_type: "individual",
          organization: null,
          country: null,
          village: null,
          state: null,
          district: null,
          individual: {
            id: 4,
            first_name: "First",
            last_name: "Last",
            contact: 6,
            stream: {
              id: 1,
              name: "Mechanical Engineering (Production)",
              created_at: "2020-06-24T07:09:35.408Z",
              updated_at: "2020-06-24T07:09:35.408Z"
            },
            is_verified: true,
            is_physically_challenged: false,
            date_of_birth: "2000-01-01T05:00:00.000Z",
            gender: "male",
            roll_number: "1552443447",
            organization: {
              id: 1,
              name: "Government Polytechnic, Mainpuri",
              contact: 2,
              zone: 1,
              rpc: 1,
              college_code: "GPM23",
              principal: null,
              is_blocked: false,
              created_at: "2020-06-24T07:18:46.679Z",
              updated_at: "2020-07-10T06:33:23.643Z"
            },
            father_full_name: "  ",
            mother_full_name: " ",
            middle_name: "Middle",
            created_at: "2020-06-24T07:29:17.103Z",
            updated_at: "2020-07-10T05:11:58.090Z"
          },
          user: {
            id: 4,
            username: "1552443447",
            email: "1552443447@gmail.com",
            provider: "local",
            confirmed: null,
            blocked: false,
            role: 7,
            state: null,
            zone: null,
            rpc: null,
            contact: 6
          },
          contacttags: [],
          qualifications: [
            {
              id: 40,
              year_of_passing: 18,
              education_year: null,
              percentage: 90,
              qualification: "secondary",
              institute: "abc",
              pursuing: false,
              contact: 6,
              board: 21,
              other_qualification: null,
              marks_obtained: 90,
              total_marks: 100,
              created_at: "2020-07-06T09:59:40.286Z",
              updated_at: "2020-07-07T17:42:13.513Z",
              other_board: "Maharashtra board"
            },
            {
              id: 41,
              year_of_passing: 20,
              education_year: null,
              percentage: 90,
              qualification: "other",
              institute: "abc",
              pursuing: false,
              contact: 6,
              board: 21,
              other_qualification: "HSC",
              marks_obtained: 90,
              total_marks: 100,
              created_at: "2020-07-06T10:01:07.023Z",
              updated_at: "2020-07-07T17:44:40.107Z",
              other_board: "Maharashtra"
            },
            {
              id: 42,
              year_of_passing: 1,
              education_year: "first",
              percentage: 60,
              qualification: "undergraduate",
              institute: "abc",
              pursuing: false,
              contact: 6,
              board: 4,
              other_qualification: null,
              marks_obtained: 60,
              total_marks: 100,
              created_at: "2020-07-06T10:04:26.597Z",
              updated_at: "2020-07-07T17:51:27.160Z",
              other_board: ""
            },
            {
              id: 43,
              year_of_passing: 8,
              education_year: "third",
              percentage: null,
              qualification: "undergraduate",
              institute: null,
              pursuing: true,
              contact: 6,
              board: 4,
              other_qualification: null,
              marks_obtained: null,
              total_marks: null,
              created_at: "2020-07-06T10:07:07.075Z",
              updated_at: "2020-07-07T17:50:43.019Z",
              other_board: ""
            },
            {
              id: 44,
              year_of_passing: 4,
              education_year: "second",
              percentage: 70,
              qualification: "undergraduate",
              institute: null,
              pursuing: false,
              contact: 6,
              board: null,
              other_qualification: null,
              marks_obtained: 70,
              total_marks: 100,
              created_at: "2020-07-07T17:54:23.071Z",
              updated_at: "2020-07-07T17:54:23.076Z",
              other_board: ""
            }
          ]
        }
      ]
    };

    let wrapper = shallow(<AddStudentToRecruitmentDrive {...props} />);

    /** Testing for manage event event filter */
    wrapper.find("#studentName").simulate("change", {
      persist: jest.fn(),
      target: { name: "name_contains", value: "Test" }
    });
    expect(wrapper.find("#studentName").props().value).toBe("Test");

    /** Testing for manage event event filter */
    wrapper.find("#mobileNumberFilter").simulate("change", {
      persist: jest.fn(),
      target: { name: "phone_contains", value: "0123456789" }
    });
    expect(wrapper.find("#mobileNumberFilter").props().value).toBe(
      "0123456789"
    );

    /** This simulates the search filter */
    wrapper.find("#submitFiter").simulate("click", {
      persist: jest.fn()
    });

    /** This simulates the clear filter */
    wrapper.find("#clearFilter").simulate("click", {
      preventDefault: jest.fn()
    });

    /** Add student to recruitment drive  */
    wrapper.find("#addStudents").simulate("click", {
      preventDefault: jest.fn()
    });

    /** Add student to manage event page  */
    wrapper.find("#backToStudentList").simulate("click", {
      preventDefault: jest.fn()
    });
  });
});
