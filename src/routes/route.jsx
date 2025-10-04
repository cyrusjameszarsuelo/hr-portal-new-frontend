import { createBrowserRouter } from "react-router";
import App from "../App";
import OrgChart from "../pages/OrgChart";
import OrgChartPaid from "../pages/OrgChartPaid";
import RootLayout from "../layout/RootLayout";
import ManageFunction from "../pages/FunctionalStructure/ManageFunction";
import FunctionalStructure from "../pages/FunctionalStructure/FunctionalStructure";
import ManageDescription from "../pages/FunctionalStructure/ManageDescription";
import OrganizationalStructure from "../pages/OrganizationalStructure/OrganizationalStructure";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <FunctionalStructure /> },
            { path: "orgchart", element: <OrgChart /> },
            { path: "manage-function/:type/:id?", element: <ManageFunction /> },
            { path: "manage-description/:subfunctionId/:descriptionId?", element: <ManageDescription /> },
            { path: "org-structure", element: <OrganizationalStructure /> },

        ],
    },
]);
