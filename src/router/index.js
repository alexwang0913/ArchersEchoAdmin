import Vue from "vue";
import Router from "vue-router";
import Full from "Container/Full";
//routes
// import defaultRoutes from "./default";
// import horizontalRoutes from "./horizontal";
// import boxedRoutes from "./boxed";
// import mini from "./mini";
// import boxedV2 from "./boxed-v2";

// session components
const SignUpOne = () => import("Views/session/SignUpOne");
const LoginOne = () => import("Views/session/LoginOne");
const LockScreen = () => import("Views/session/LockScreen");
const ForgotPassword = () => import("Views/session/ForgotPassword");
const ResetPassword = () => import("Views/session/ResetPassword");

const Auth0CallBack = () => import("Components/Auth0Callback/Auth0Callback");

const UserPage = () => import("Views/pages/UserManagement");
const PotentialSupport = () => import("Views/pages/PotentialSupport");
const Upload = () => import("Views/pages/Upload");
const Dashboard = () => import("Views/pages/Dashboard");
const Rule = () => import("Views/pages/Rule");
const WindowsEventLog = () => import("Views/pages/WindowsEventLog");
const UserProfile = () => import("Views/pages/UserProfile");
const XmlEdit = () => import("Views/pages/XmlEdit");
const HelpDesk = () => import("Views/pages/HelpDeskTicket/Index");
const HelpDeskDetail = () => import("Views/pages/HelpDeskTicket/Detail");

Vue.use(Router);

export default new Router({
  mode: "history",
  base: "/admin",
  routes: [
    // defaultRoutes,
    // horizontalRoutes,
    // boxedRoutes,
    // mini,
    // boxedV2,
    {
      path: "/callback",
      component: Auth0CallBack
    },
    {
      path: "/session/sign-up",
      component: SignUpOne,
      meta: {
        title: "message.signUp",
        breadcrumb: "Session / Sign Up"
      }
    },
    {
      path: "/login",
      component: LoginOne,
      meta: {
        title: "message.login",
        breadcrumb: "Login"
      }
    },
    {
      path: "/",
      component: Full,
      redirect: "/dashboard",
      children: [
        {
          path: "/users",
          component: UserPage,
          meta: {
            requiresAuth: true,
            title: "User Management",
            breadcrumb: "User Management"
          }
        },
        {
          path: "/potential_support",
          component: PotentialSupport,
          meta: {
            requiresAuth: true,
            title: "Potential Support",
            breadcrumb: "Potential Support"
          }
        },
        {
          path: "/upload",
          component: Upload,
          meta: {
            requiresAuth: true,
            title: "Upload",
            breadcrumb: "Upload StatusRepoter"
          }
        },
        {
          path: "/dashboard",
          component: Dashboard,
          meta: {
            requiresAuth: true,
            title: "Dashboard",
            breadcrumb: "Dashboard"
          }
        },
        {
          path: "/rule",
          component: Rule,
          meta: {
            requiresAuth: true,
            title: "Rule",
            breadcrumb: "Rule"
          }
        },
        {
          path: "/eventLog",
          component: WindowsEventLog,
          meta: {
            requiresAuth: true,
            title: "Windows EventLog",
            breadcrumb: "Windows EventLog"
          }
        },
        {
          path: "/userProfile/:userId",
          component: UserProfile,
          meta: {
            requiresAuth: true,
            title: "User Profile",
            breadcrumb: "Users / User Profile"
          }
        },
        {
          path: "/xmlEdit",
          component: XmlEdit,
          meta: {
            requiresAuth: true,
            title: "XML edit",
            breadcrumb: "XML Edit"
          }
        },
        {
          path: "/helpdeskManagement",
          component: HelpDesk,
          meta: {
            requiresAuth: true,
            title: "Help Desk",
            breadcrumb: "Help Desk"
          }
        },
        {
          path: "/helpdeskDetail/:ticketId",
          component: HelpDeskDetail,
          meta: {
            requiresAuth: true,
            title: "HelpDeskDetail",
            breadcrumb: "HelpDeskDetail"
          }
        }
      ]
    },
    {
      path: "/session/forgot-password",
      component: ForgotPassword,
      meta: {
        title: "message.forgotPassword",
        breadcrumb: "Session / Forgot Password"
      }
    },
    {
      path: "/session/reset-password",
      component: ResetPassword,
      meta: {
        title: "message.resetPassword",
        breadcrumb: "Session / Reset Password"
      }
    }
  ]
});
