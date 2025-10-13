import { createBrowserRouter } from "react-router";
// import OrgChart from "../pages/OrgChart";
import RootLayout from "../layout/RootLayout";
import ManageFunction from "../pages/FunctionalStructure/ManageFunction";
import FunctionalStructure from "../pages/FunctionalStructure/FunctionalStructure";
import ManageDescription from "../pages/FunctionalStructure/ManageDescription";
import OrganizationalStructure from "../pages/OrganizationalStructure/OrganizationalStructure";

import Auth from "../pages/Auth/Auth";
import LoginSuccess from "../pages/Auth/LoginSuccess";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <FunctionalStructure /> },
            // { path: "orgchart", element: <OrgChart /> },
            { path: "manage-function/:type/:id?", element: <ManageFunction /> },
            { path: "manage-description/:subfunctionId/:descriptionId?", element: <ManageDescription /> },
            { path: "org-structure", element: <OrganizationalStructure /> },

        ],
    },
    // Auth route should not inherit RootLayout so it can display a standalone login page
    { path: "/auth", element: <Auth /> },
    { path: "/login-success", element: <LoginSuccess /> },
]);
