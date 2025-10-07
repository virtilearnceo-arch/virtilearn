import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  CreditCard,
  Settings2,
  Plus,
  Pencil,
  CircleDot,
  Video,
  Film,
  Monitor,
  HelpCircle,
  Layers,
  BarChart2,
  LineChart,
  UserCog,
  LogOut,
  Star,
  Code,
  Layout
} from "lucide-react";

export const navMain = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/dashboard/users",
    icon: Users,
  },
    {
    title: "Instructors",
    url: "/admin/dashboard/instructor",
    icon: Users,
  },
  {
    title: "Invoices",
    url: "/admin/dashboard/invoices",
    icon: CreditCard,
  },
  {
    title: "Internship Invoices",
    url: "/admin/dashboard/internshipInvoices",
    icon: CreditCard,
  },
  {
    title: "Courses",
    icon: BookOpen,
    items: [
      {
        title: "All Courses",
        url: "/admin/dashboard/courses",
        icon: Film,
      },
      {
        title: "Create New",
        url: "/admin/dashboard/courses/new",
        icon: Plus,
      },
    ],
  },
{
  title: "Internships",
  icon: BookOpen,
  items: [
    {
      title: "All Internships",
      url: "/admin/dashboard/internships",
      icon: Film,
    },
    {
      title: "Create New",
      url: "/admin/dashboard/internships/new",
      icon: Plus,
    },
    {
      title: "Manage Sections",
      url: "/admin/dashboard/internships/sections",
      icon: Layout,
    },
    {
      title: "Manage Projects",
      url: "/admin/dashboard/internships/projects",
      icon: Code,
    },
    {
      title: "Manage Quizzes",
      url: "/admin/dashboard/internships/quizzes",
      icon: HelpCircle,
    },
    {
      title: "Manage Resources",
      url: "/admin/dashboard/internships/resources",
      icon: HelpCircle,
    },
    
    {
      title: "Enrolled Users",
      url: "/admin/dashboard/internships/users",
      icon: Users,
    },
  ],
},

  {
    title: "Customization",
    icon: Layers,
    items: [
     
      {
        title: "FAQ",
        url: "/admin/dashboard/customization/faq",
        icon: HelpCircle,
      },
      {
        title: "Categories",
        url: "/admin/dashboard/customization/categories",
        icon: CircleDot,
      },
      {
        title: "Coupon",
        url: "/admin/dashboard/customization/coupon",
        icon: CircleDot,
      },
    ],
  },
  // {
  //   title: "Controllers",
  //   url: "/admin/dashboard/team",
  //   icon: UserCog,
  // },
  {
    title: "Analytics",
    icon: BarChart2,
    items: [
      {
        title: "Courses Analytics",
        url: "/admin/dashboard/analytics/course-analytics",
        icon: BarChart2,
      },
      {
        title: "Orders Analytics",
        url: "/admin/dashboard/analytics/orders-analytics",
        icon: LineChart,
      },
      {
        title: "Users Analytics",
        url: "/admin/dashboard/analytics/user-analytics",
        icon: LineChart,
      },
    ],
  },
  
];
