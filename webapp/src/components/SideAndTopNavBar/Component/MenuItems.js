import React from "react";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import EmojiFlagsOutlinedIcon from "@material-ui/icons/EmojiFlagsOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import LocalLibraryOutlinedIcon from "@material-ui/icons/LocalLibraryOutlined";

import auth from "../../Auth/Auth";
import * as routeConstants from "../../../constants/RouteConstants";
import * as roleConstants from "../../../constants/RoleConstants";

const MenuItems = props => {
  const getCollegeAdminMenus = () => {
    let dataToReturn = [];
    if (
      auth.getUserInfo() !== null &&
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
      auth.getUserInfo().studentInfo !== null
    ) {
      if (
        auth.getUserInfo().studentInfo.organization.contact.id ===
        auth.getUserInfo().rpc.main_college
      ) {
        dataToReturn = [
          {
            name: "Dashboard",
            link: routeConstants.DASHBOARD_URL,
            Icon: <DashboardIcon />
          },
          {
            name: "College Profile",
            link: routeConstants.VIEW_COLLEGE,
            Icon: <LocalLibraryOutlinedIcon />
          },
          {
            name: "Students",
            Icon: <GroupOutlinedIcon />,
            items: [
              {
                name: "Manage Students",
                link: routeConstants.MANAGE_STUDENT
              },
              {
                name: "Import Students",
                link: routeConstants.IMPORT_STUDENTS
              }
            ]
          },
          {
            name: "Activity",
            Icon: <AssignmentOutlinedIcon />,
            link: routeConstants.MANAGE_ACTIVITY
          },
          {
            name: "Events",
            Icon: <EmojiFlagsOutlinedIcon />,
            link: routeConstants.MANAGE_EVENT
          },
          {
            name: "Feedback",
            Icon: <GroupOutlinedIcon />,
            items: [
              {
                name: "Activity Feedback",
                Icon: <AssignmentOutlinedIcon />,
                link: routeConstants.FEEDBACK_ACTIVITIES
              },
              {
                name: "Events Feedback",
                Icon: <EmojiFlagsOutlinedIcon />,
                link: routeConstants.FEEDBACK_EVENTS
              }
            ]
          }
        ];
      } else {
        dataToReturn = [
          {
            name: "Dashboard",
            link: routeConstants.DASHBOARD_URL,
            Icon: <DashboardIcon />
          },
          {
            name: "College Profile",
            link: routeConstants.VIEW_COLLEGE,
            Icon: <LocalLibraryOutlinedIcon />
          },
          {
            name: "Students",
            Icon: <GroupOutlinedIcon />,
            items: [
              {
                name: "Manage Students",
                link: routeConstants.MANAGE_STUDENT
              },
              {
                name: "Import Students",
                link: routeConstants.IMPORT_STUDENTS
              }
            ]
          },
          {
            name: "Activity",
            Icon: <AssignmentOutlinedIcon />,
            link: routeConstants.MANAGE_ACTIVITY
          },
          {
            name: "Events",
            Icon: <EmojiFlagsOutlinedIcon />,
            link: routeConstants.MANAGE_EVENT
          }
        ];
      }
    }

    return dataToReturn;
  };
  const menuItems = {
    [roleConstants.DEPARTMENTADMIN]: [
      {
        name: "Dashboard",
        link: routeConstants.DASHBOARD_URL,
        Icon: <DashboardIcon />
      }
    ],
    [roleConstants.MEDHAADMIN]: [
      {
        name: "Dashboard",
        link: routeConstants.DASHBOARD_URL,
        Icon: <DashboardIcon />
      },
      {
        name: "Masters",
        Icon: <AssignmentIndOutlinedIcon />,
        items: [
          {
            name: "State",
            link: routeConstants.MANAGE_STATES
          },
          {
            name: "Zone",
            link: routeConstants.MANAGE_ZONES
          },
          {
            name: "RPC",
            link: routeConstants.MANAGE_RPC
          },
          {
            name: "College",
            link: routeConstants.MANAGE_COLLEGE
          }
        ]
      },
      {
        name: "User Management",
        link: routeConstants.MANAGE_USER,
        Icon: <PeopleOutlineOutlinedIcon />
      },
      {
        name: "Activity",
        Icon: <AssignmentOutlinedIcon />,
        link: routeConstants.MANAGE_ACTIVITY
      },
      {
        name: "Events",
        link: routeConstants.MANAGE_EVENT,
        Icon: <EmojiFlagsOutlinedIcon />
      }
    ],
    [roleConstants.COLLEGEADMIN]: getCollegeAdminMenus(),
    [roleConstants.STUDENT]: [
      {
        name: "Profile",
        Icon: <PersonOutlineOutlinedIcon />,
        link: routeConstants.VIEW_PROFILE,
        tabItems: [
          {
            name: "Personal Details",
            link: routeConstants.VIEW_PROFILE,
            availableRoutes: [
              routeConstants.VIEW_PROFILE,
              routeConstants.EDIT_PROFILE
            ]
          },
          {
            name: "Education",
            link: routeConstants.VIEW_EDUCATION,
            availableRoutes: [
              routeConstants.VIEW_EDUCATION,
              routeConstants.ADD_EDUCATION,
              routeConstants.EDIT_EDUCATION
            ]
          },
          {
            name: "Documents",
            link: routeConstants.VIEW_DOCUMENTS,
            availableRoutes: [
              routeConstants.VIEW_DOCUMENTS,
              routeConstants.ADD_DOCUMENTS
            ]
          },
          {
            name: "Past Activities",
            link: routeConstants.VIEW_PAST_ACTIVITIES,
            availableRoutes: [routeConstants.VIEW_PAST_ACTIVITIES]
          },
          {
            name: "Past Events",
            link: routeConstants.VIEW_PAST_EVENTS,
            availableRoutes: [routeConstants.VIEW_PAST_EVENTS]
          }
        ]
      },
      {
        name: "Upcoming Activities",
        link: routeConstants.ELIGIBLE_ACTIVITY,
        Icon: <AssignmentOutlinedIcon />
      },
      {
        name: "Upcoming Events",
        link: routeConstants.ELIGIBLE_EVENT,
        Icon: <EmojiFlagsOutlinedIcon />
      }
    ],
    [roleConstants.RPCADMIN]: [
      {
        name: "Dashboard",
        link: routeConstants.DASHBOARD_URL,
        Icon: <DashboardIcon />
      },
      {
        name: "Activity Feedback",
        Icon: <AssignmentOutlinedIcon />,
        link: routeConstants.FEEDBACK_ACTIVITIES
      },
      {
        name: "Events Feedback",
        Icon: <EmojiFlagsOutlinedIcon />,
        link: routeConstants.FEEDBACK_EVENTS
      }
    ],
    [roleConstants.ZONALADMIN]: [
      {
        name: "Dashboard",
        link: routeConstants.DASHBOARD_URL,
        Icon: <DashboardIcon />
      },
      {
        name: "Feedback",
        Icon: <GroupOutlinedIcon />,
        items: [
          {
            name: "Activity Feedback",
            Icon: <AssignmentOutlinedIcon />,
            link: routeConstants.FEEDBACK_ACTIVITIES
          },
          {
            name: "Events Feedback",
            Icon: <EmojiFlagsOutlinedIcon />,
            link: routeConstants.FEEDBACK_EVENTS
          }
        ]
      }
    ]
  };

  return menuItems;
};

export default MenuItems;
