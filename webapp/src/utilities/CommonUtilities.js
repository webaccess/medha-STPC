import { Auth as auth } from "../components";
import * as routeConstants from "../constants/RouteConstants";
import * as serviceProvider from "../api/Axios";
import * as apiConstants from "../constants/StrapiApiConstants";

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

export const updateUser = async () => {
  await serviceProvider
    .serviceProviderForGetRequest(
      apiConstants.STRAPI_DB_URL + apiConstants.STRAPI_CURRENT_USER
    )
    .then(res => {
      auth.setUserInfo(res.data.result, true);
    })
    .catch(error => {
      console.log("Failed updating user");
    });
};
