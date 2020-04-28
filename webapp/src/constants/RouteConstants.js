/** Below array entirely depends on what we have in the ./src/components/SideAndTopNavBar/Component/MenuItem.js */

export const FORGOT_PASSWORD_URL = "/forgot-password";
export const SIGN_IN_URL = "/login";
export const LOGOUT_URL = "/logout";
export const CHANGE_PASSWORD = "/change-password";
export const NOT_FOUND_URL = "/404";

/** Dashboard */
export const DASHBOARD_URL = "/dashboard";
export const DEFAULT_URL = "/";

/**Student */
export const NEW_REGISTRATION_URL = "/registration";
export const REGISTERED = "/registered";
export const REQUIRED_CONFORMATION = "/requiredconformation";
export const REQUIRED_ERROR_PAGE = "/authorization-error";
export const VIEW_PROFILE = "/view-profile";
export const EDIT_PROFILE = "/edit-profile";

export const VIEW_EDUCATION = "/view-education";
export const ADD_EDUCATION = "/add-education";
export const EDIT_EDUCATION = "/edit-education";
export const MANAGE_STUDENT = "/manage-student";
export const VALIDATE_STUDENT = "/validate-student";
export const PROFILE = "/profile";
export const VIEW_PAST_ACTIVITIES = "/past-activities";
export const VIEW_PAST_EVENTS = "/past-events";

export const ADD_STUDENT_FROM_COLLEGE_ADMIN = "/college-add-student";
export const EDIT_STUDENT_FROM_COLLEGE_ADMIN = "/college-edit-student";

/**Student Documents */
export const VIEW_DOCUMENTS = "/view-documents";
export const EDIT_DOCUMENTS = "/edit-documents";
export const ADD_DOCUMENTS = "/add-documents";

/**Student Academic history */
export const VIEW_ACADEMIC_HISTORY = "/view-academic-history";
export const ADD_ACADEMIC_HISTORY = "/add-academic-history";
export const EDIT_ACADEMIC_HISTORY = "/edit-academic-history";

/** College */
export const ADD_COLLEGE = "/add-college";
export const MANAGE_COLLEGE = "/manage-college";
export const EDIT_COLLEGE = "/edit-college";
export const VIEW_COLLEGE = "/view-college";

/**OTP */
export const REQUEST_OTP = "/requestotp";
export const VERIFY_OTP = "/verifyotp";

/** User management */
/** user */
export const EDIT_USER = "/edit-user";
export const MANAGE_USER = "/manage-user";
export const EVENTS = "/events";
export const VIEW_USER = "/view-user";
export const ADD_USER = "/add-user";

/** Masters */
/** State */
export const EDIT_STATE = "/edit-state";
export const MANAGE_STATES = "/manage-states";
export const ADD_STATES = "/add-states";

/** Zone */
export const EDIT_ZONES = "/edit-zones";
export const MANAGE_ZONES = "/manage-zones";
export const ADD_ZONES = "/add-zones";

/** RPC's */
export const MANAGE_RPC = "/manage-rpc";
export const ADD_RPC = "/add-rpc";
export const EDIT_RPC = "/edit-rpc";

/**Event's */
export const MANAGE_EVENT = "/manage-events";
export const VIEW_EVENT = "/view-event";
export const ADD_EVENT = "/add-event";
export const EDIT_EVENT = "/edit-event";
export const ELIGIBLE_EVENT = "/eligible-event";
export const EVENT_STUDENT_LIST = "/event-student-list";
export const VIEW_STUDENT_PROFILE = "/view-student-profile";
export const ADD_STUDENT_DRIVE = "/add-student-recruitment-drive";

/**Training and Activity */
export const EDIT_ACTIVITY = "/edit-activity";
export const ADD_ACTIVITY = "/add-activity";
export const MANAGE_ACTIVITY = "/manage-activity";
export const VIEW_ACTIVITY = "/view-activity";
export const ELIGIBLE_ACTIVITY = "/eligible-activity";

/**Activty Batches */
export const MANAGE_ACTIVITY_BATCH = "/manage-activity-batch/:activity";
export const ADD_ACTIVITY_BATCH = "/add-activity-batch/:activity";
export const EDIT_ACTIVITY_BATCH = "/edit-activity-batch/:activity";
export const VIEW_ACTIVITY_BATCH = "/view-activity-batch/:activity";

/** Medha Admin */

let dashboard_medha_admin = [];
let masters_medha_admin = [];
let user_management_medha_admin = [];
let activity_medha_admin = [];
let events_medha_admin = [];

dashboard_medha_admin.push(DASHBOARD_URL, DEFAULT_URL);

masters_medha_admin.push(
  EDIT_STATE,
  MANAGE_STATES,
  ADD_STATES,
  EDIT_ZONES,
  MANAGE_ZONES,
  ADD_ZONES,
  MANAGE_RPC,
  ADD_RPC,
  EDIT_RPC,
  ADD_COLLEGE,
  MANAGE_COLLEGE,
  EDIT_COLLEGE,
  VIEW_COLLEGE
);

user_management_medha_admin.push(
  EDIT_USER,
  MANAGE_USER,
  EVENTS,
  VIEW_USER,
  ADD_USER
);

activity_medha_admin.push(
  EDIT_ACTIVITY,
  ADD_ACTIVITY,
  MANAGE_ACTIVITY,
  VIEW_ACTIVITY,
  ELIGIBLE_ACTIVITY
);

events_medha_admin.push(
  MANAGE_EVENT,
  VIEW_EVENT,
  ADD_EVENT,
  EDIT_EVENT,
  ELIGIBLE_EVENT,
  EVENT_STUDENT_LIST,
  VIEW_STUDENT_PROFILE,
  ADD_STUDENT_DRIVE
);

export const MEDHA_ADMIN = [
  { key: 0, value: dashboard_medha_admin },
  { key: 1, value: masters_medha_admin },
  { key: 2, value: user_management_medha_admin },
  { key: 3, value: activity_medha_admin },
  { key: 4, value: events_medha_admin }
];

/** college admin */
let dashboard_college_admin = [];
let college_profile_admin_admin = [];
let students_college_admin = [];
let activity_college_admin = [];
let events_college_admin = [];

dashboard_college_admin.push(DASHBOARD_URL, DEFAULT_URL);

college_profile_admin_admin.push(EDIT_COLLEGE, VIEW_COLLEGE);

events_college_admin.push(
  MANAGE_EVENT,
  VIEW_EVENT,
  ADD_EVENT,
  EDIT_EVENT,
  ELIGIBLE_EVENT,
  EVENT_STUDENT_LIST,
  VIEW_STUDENT_PROFILE,
  ADD_STUDENT_DRIVE
);

activity_college_admin.push(
  EDIT_ACTIVITY,
  ADD_ACTIVITY,
  MANAGE_ACTIVITY,
  VIEW_ACTIVITY,
  ELIGIBLE_ACTIVITY
);

students_college_admin.push(
  MANAGE_STUDENT,
  VIEW_PROFILE,
  EDIT_PROFILE,
  ADD_STUDENT_FROM_COLLEGE_ADMIN,
  EDIT_STUDENT_FROM_COLLEGE_ADMIN
);

export const COLLEGE_ADMIN = [
  { key: 0, value: dashboard_college_admin },
  { key: 1, value: college_profile_admin_admin },
  { key: 2, value: students_college_admin },
  { key: 3, value: activity_college_admin },
  { key: 4, value: events_college_admin }
];

/** Student */
let profile_students = [];
let activity_students = [];
let events_students = [];

profile_students.push(
  DEFAULT_URL,
  VIEW_EDUCATION,
  ADD_EDUCATION,
  EDIT_EDUCATION,
  VIEW_DOCUMENTS,
  EDIT_DOCUMENTS,
  ADD_DOCUMENTS,
  VIEW_ACADEMIC_HISTORY,
  ADD_ACADEMIC_HISTORY,
  EDIT_ACADEMIC_HISTORY,
  VIEW_PROFILE,
  EDIT_PROFILE
);
activity_students.push(ELIGIBLE_ACTIVITY, VIEW_ACTIVITY);
events_students.push(ELIGIBLE_EVENT, VIEW_EVENT);

export const STUDENT = [
  { key: 0, value: profile_students },
  { key: 1, value: activity_students },
  { key: 2, value: events_students }
];
