import React from "react";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import EmojiFlagsOutlinedIcon from "@material-ui/icons/EmojiFlagsOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import LocalLibraryOutlinedIcon from "@material-ui/icons/LocalLibraryOutlined";

import * as routeConstants from "../../../constants/RouteConstants";
import * as roleConstants from "../../../constants/RoleConstants";

const MenuItems = props => {
  const menuItems = {
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
    [roleConstants.COLLEGEADMIN]: [
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
    ],
    [roleConstants.STUDENT]: [
      {
        name: "Profile",
        Icon: <PersonOutlineOutlinedIcon />,
        link: routeConstants.VIEW_PROFILE,
        tabItems: [
          {
            name: "Personal Details",
            link: routeConstants.VIEW_PROFILE
          },
          {
            name: "Academic History",
            link: routeConstants.VIEW_ACADEMIC_HISTORY
          },
          {
            name: "Documents",
            link: routeConstants.VIEW_DOCUMENTS
          },
          {
            name: "Education",
            link: routeConstants.VIEW_EDUCATION
          },
          {
            name: "Activities",
            link: routeConstants.VIEW_PAST_ACTIVITIES
          },
          {
            name: "Events",
            link: routeConstants.VIEW_PAST_EVENTS
          }
        ]
      },
      {
        name: "Activity",
        link: routeConstants.ELIGIBLE_ACTIVITY,
        Icon: <AssignmentOutlinedIcon />
      },
      {
        name: "Events",
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
        name: "Activity",
        Icon: <AssignmentOutlinedIcon />,
        link: routeConstants.FEEDBACK_ACTIVITIES
      },
      {
        name: "Events",
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
        name: "Activity",
        Icon: <AssignmentOutlinedIcon />,
        link: routeConstants.FEEDBACK_ACTIVITIES
      },
      {
        name: "Events",
        Icon: <EmojiFlagsOutlinedIcon />,
        link: routeConstants.FEEDBACK_EVENTS
      }
    ]
  };

  return menuItems;
};

export default MenuItems;
