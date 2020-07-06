import { isEmpty } from "lodash";

const TOKEN_KEY = "jwtToken";
const USER_INFO = "userInfo";

const parse = JSON.parse;
const stringify = JSON.stringify;

const auth = {
  /**
   * Remove an item from the used storage
   * @param  {String} key [description]
   */
  clear(key) {
    if (localStorage && localStorage.getItem(key)) {
      return localStorage.removeItem(key);
    }
    return null;
  },

  /**
   * Clear all app storage
   */
  clearAppStorage() {
    if (localStorage) {
      localStorage.clear();
    }
  },

  clearToken(tokenKey = TOKEN_KEY) {
    return auth.clear(tokenKey);
  },

  clearUserInfo(userInfo = USER_INFO) {
    return auth.clear(userInfo);
  },

  /**
   * Returns data from storage
   * @param  {String} key Item to get from the storage
   * @return {String|Object}     Data from the storage
   */
  get(key) {
    if (localStorage && localStorage.getItem(key)) {
      return parse(localStorage.getItem(key)) || null;
    }
    return null;
  },

  getToken(tokenKey = TOKEN_KEY) {
    return auth.get(tokenKey);
  },

  getUserInfo(userInfo = USER_INFO) {
    return auth.get(userInfo);
  },

  getStudentInfoForEditingFromCollegeAdmin() {
    return auth.get("StudentProfile");
  },

  getStudentIdFromCollegeAdmin() {
    return auth.get("StudentUserId");
  },

  getStudentIdFromCollegeAdminForDocument() {
    return auth.get("StudentIdForDocument");
  },

  /**
   * Set data in storage
   * @param {String|Object}  value    The data to store
   * @param {String}  key
   * @param {Boolean} isLocalStorage  Defines if we need to store in localStorage or sessionStorage
   */
  set(value, key, isLocalStorage) {
    if (isEmpty(value)) {
      return null;
    }

    if (isLocalStorage && localStorage) {
      return localStorage.setItem(key, stringify(value));
    }
    return null;
  },

  setToken(value = "", isLocalStorage = false, tokenKey = TOKEN_KEY) {
    return auth.set(value, tokenKey, isLocalStorage);
  },

  setStudentInfoForEditingFromCollegeAdmin(studentInfoForEditing) {
    localStorage.setItem("StudentProfile", studentInfoForEditing);
  },

  setStudentIdFromCollegeAdmin(StudentIdFromCollegeAdmin) {
    localStorage.setItem("StudentUserId", StudentIdFromCollegeAdmin);
  },

  setStudentIdFromCollegeAdminForDocument(
    StudentIdFromCollegeAdminForDocument
  ) {
    localStorage.setItem(
      "StudentIdForDocument",
      StudentIdFromCollegeAdminForDocument
    );
  },

  setUserInfo(value = "", isLocalStorage = false, userInfo = USER_INFO) {
    return auth.set(value, userInfo, isLocalStorage);
  }
};

export default auth;
