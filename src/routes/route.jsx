import { createBrowserRouter } from "react-router";
// import OrgChart from "../pages/OrgChart";
import RootLayout from "../layout/RootLayout";
import ManageFunction from "../pages/FunctionalStructure/ManageFunction";
import FunctionalStructure from "../pages/FunctionalStructure/FunctionalStructure";
import FunctionsAuditLogs from "../pages/FunctionalStructure/FunctionsAuditLogs";
import ManageDescription from "../pages/FunctionalStructure/ManageDescription";
import OrganizationalStructure from "../pages/OrganizationalStructure/OrganizationalStructure";

import Auth from "../pages/Auth/Auth";
import LoginSuccess from "../pages/Auth/LoginSuccess";
import MyProfile from "../pages/MyProfile/MyProfile";
import OrganizationalAuditLogs from "../pages/OrganizationalStructure/OrganizationalAuditLogs";
import ManageProfile from "../pages/MyProfile/ManageProfile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <FunctionalStructure /> },
            { path: "manage-function/:type/:id?", element: <ManageFunction /> },
            { path: "functions-audit-logs", element: <FunctionsAuditLogs /> },
            {
                path: "manage-description/:subfunctionId/:descriptionId?",
                element: <ManageDescription />,
            },
            { path: "org-structure", element: <OrganizationalStructure /> },
            {
                path: "org-structure-audit-logs",
                element: <OrganizationalAuditLogs />,
            },
            { path: "my-profile", element: <MyProfile /> },
            { path: "my-profile/:profileId", element: <ManageProfile /> },
        ],
    },

    { path: "/auth", element: <Auth /> },
    { path: "/login-success", element: <LoginSuccess /> },
]);
