import { Auth as auth } from "../components";
import * as routeConstants from "../constants/RouteConstants";

export const setSideBarIndex = path => {
  let id = 0;
  if (
    auth.getUserInfo() !== undefined &&
    auth.getUserInfo() !== null &&
    auth.getUserInfo().role !== null
  ) {
    if (auth.getUserInfo().role.name === "College Admin") {
      id = returnId(routeConstants.COLLEGE_ADMIN, path);
    } else if (auth.getUserInfo().role.name === "Medha Admin") {
      id = returnId(routeConstants.MEDHA_ADMIN, path);
    } else if (auth.getUserInfo().role.name === "Student") {
      id = returnId(routeConstants.STUDENT, path);
    }
  }
  return id;
};

function returnId(array, path) {
  let id = 0;
  if (path === "/change-password") {
    return null;
  } else {
    for (let index in array) {
      if (array[index]["value"].indexOf(path) > -1) {
        id = array[index]["key"];
        break;
      }
    }
    return id;
  }
}
