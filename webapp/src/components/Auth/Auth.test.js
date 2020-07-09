import auth from "./Auth";
import * as medhaUser from "../../mockuser/MedhaAdmin.json";
import * as studentUser from "../../mockuser/StudentUser.json";

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  auth.clearAppStorage();
});

describe("Testing Auth", () => {
  it(" renders without crashing when auth is not null and user is medha admin", () => {
    auth.setToken(medhaUser.jwt, true);
    auth.setUserInfo(medhaUser.user, true);
    expect(auth.clear("jwt")).toEqual(null);
  });

  // it(" renders without crashing when auth is null", () => {
  //   auth.clearAppStorage();
  //   auth.setToken(null, true);
  //   auth.setUserInfo(null, true);
  //   expect(wrapper).toBeDefined();
  // });

  // it(" renders without crashing when auth is not null and user is not medha admin", () => {
  //   auth.setToken(studentUser.jwt, true);
  //   auth.setUserInfo(studentUser.user, true);
  //   expect(wrapper).toBeDefined();
  // });
});
