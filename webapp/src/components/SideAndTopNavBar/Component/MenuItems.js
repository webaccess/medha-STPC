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

const MenuItems = props => {
  const menuItems = {
    "Medha Admin": [
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
            link: routeConstants.VIEW_STATES
          },
          {
            name: "Zone",
            link: routeConstants.VIEW_ZONES
          },
          {
            name: "RPC",
            link: routeConstants.VIEW_RPC
          },
          {
            name: "College",
            link: routeConstants.VIEW_COLLEGE
          }
        ]
      },
      {
        name: "User Management",
        link: routeConstants.VIEW_USER,
        Icon: <PeopleOutlineOutlinedIcon />
      },
      {
        name: "Training",
        Icon: <AssignmentOutlinedIcon />,
        items: [
          {
            name: "Manage Training",
            link: routeConstants.MANAGE_TRAINING
          },
          {
            name: "Validate Student",
            link: routeConstants.VALIDATE_STUDENT
          }
        ]
      },
      {
        name: "Events",
        link: routeConstants.MANAGE_EVENT,
        Icon: <EmojiFlagsOutlinedIcon />
      },
      {
        name: "Profile",
        link: routeConstants.PROFILE,
        Icon: <PersonOutlineOutlinedIcon />
      }
    ],
    "College Admin": [
      {
        name: "Dashboard",
        link: routeConstants.DASHBOARD_URL,
        Icon: <DashboardIcon />
      },
      {
        name: "College Profile",
        link: routeConstants.DETAIL_COLLEGE,
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
            link: ""
          }
        ]
      },
      {
        name: "Training",
        Icon: <AssignmentOutlinedIcon />,
        items: [
          {
            name: "Manage Students Group",
            link: ""
          },
          {
            name: "Validate Student",
            link: ""
          }
        ]
      },
      {
        name: "Events",
        Icon: <EmojiFlagsOutlinedIcon />,
        link: ""
      }
    ],
    Student: [
      {
        name: "Profile",
        Icon: <PersonOutlineOutlinedIcon />,
        items: [
          {
            name: "Personal Details",
            link: routeConstants.VIEW_PROFILE
          },
          {
            name: "Education",
            link: routeConstants.VIEW_EDUCATION
          },
          {
            name: "Documents",
            link: routeConstants.VIEW_DOCUMENTS
          },
          {
            name: "Academic History",
            link: routeConstants.VIEW_ACADEMIC_HISTORY
          }
        ]
      },
      {
        name: "Training",
        link: "",
        Icon: <AssignmentOutlinedIcon />
      },
      {
        name: "Events",
        link: routeConstants.ELIGIBLE_EVENT,
        Icon: <EmojiFlagsOutlinedIcon />
      }
    ]
  };

  return menuItems;
};

export default MenuItems;
