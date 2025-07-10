import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuSquareCheck,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "03",
    label: "Create Task",
    icon: LuSquareCheck,
    path: "/admin/create-task",
  },
  {
    id: "04",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/user/my-tasks",
  },

  /* generally number 3, 4, 5 are given only in admin role */
  {
    id: "03",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/user/manage-tasks",
  },
  {
    id: "04",
    label: "Create Task",
    icon: LuSquareCheck,
    path: "/user/create-task",
  },
  {
    id: "05",
    label: "Team Members",
    icon: LuUsers,
    path: "/user/users",
  },
  {
    id: "06",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];
export const PRIORITY_DATA = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const STATUS_DATA = [
  { label: "Pending", value: "medium" },
  { label: "In-Progress", value: "In-Programs" },
  { label: "completed", value: "Completed" },
];
