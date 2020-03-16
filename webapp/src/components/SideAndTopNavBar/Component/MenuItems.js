import React from "react";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import EmojiFlagsOutlinedIcon from "@material-ui/icons/EmojiFlagsOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import * as routeConstants from "../../../constants/RouteConstants";

const MenuItems = props => {
  const menuItems = {
    "Medha Admin": [
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
        link: routeConstants.EVENTS,
        Icon: <EmojiFlagsOutlinedIcon />
      },
      {
        name: "Profile",
        link: routeConstants.PROFILE,
        Icon: <PersonOutlineOutlinedIcon />
      },
      {
        name: "User Management",
        link: routeConstants.VIEW_USER,
        Icon: <PeopleOutlineOutlinedIcon />
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
      }
    ],
    "College Admin": [
      {
        name: "College",
        link: "",
        Icon: ""
      },
      {
        name: "Students",
        Icon: "",
        items: [
          {
            name: "Manage Students",
            link: ""
          },
          {
            name: "Import Students",
            link: ""
          }
        ]
      },
      {
        name: "Training",
        Icon: "",
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
        Icon: ""
      }
    ],
    Student: [
      {
        name: "Training",
        link: "",
        Icon: <AssignmentOutlinedIcon />
      },
      {
        name: "Events",
        link: "",
        Icon: <EmojiFlagsOutlinedIcon />
      },
      {
        name: "Profile",
        link: "",
        Icon: <PersonOutlineOutlinedIcon />
      }
    ]
  };

  return menuItems;
};

export default MenuItems;
