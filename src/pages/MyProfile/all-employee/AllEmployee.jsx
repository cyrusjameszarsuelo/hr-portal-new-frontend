import Title from "@/components/Title";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/DataTable/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getOrgStructure } from "@/utils/org_structure";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const getAllEmployeeHeader = ({ navigate }) => {
    return [
        // {
        //     accessorKey: "id",
        //     header: "ID",
        //     cell: ({ row }) => (
        //         <div className="capitalize">{row.getValue("id")}</div>
        //     ),
        // },
        {
            accessorKey: "firstname",
            header: "First Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("firstname")}</div>
            ),
        },
        {
            accessorKey: "lastname",
            header: "Last Name",
            cell: ({ row }) => (
                <div className="capitalize m-2">{row.getValue("lastname")}</div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Email
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="lowercase m-2">{row.getValue("email")}</div>
            ),
        },
        {
            accessorKey: "position_title",
            header: "Position Title",
            cell: ({ row }) => (
                <div className="capitalize m-2">
                    {row.getValue("position_title")}
                </div>
            ),
        },
        {
            accessorKey: "reporting",
            header: "Reporting To",
            cell: ({ row }) => (
                <div className="capitalize m-2">
                    {row.getValue("reporting")}
                </div>
            ),
        },
        {
            accessorKey: "emp_no",
            header: "Employee No.",
            cell: ({ row }) => (
                <div className="capitalize m-2">{row.getValue("emp_no")}</div>
            ),
        },
        {
            accessorKey: "department",
            header: "Deparment",
            cell: ({ row }) => (
                <div className="capitalize m-2">
                    {row.getValue("department")}
                </div>
            ),
        },
        {
            accessorKey: "business_unit",
            header: "Business Unit",
            cell: ({ row }) => (
                <div className="capitalize m-2">
                    {row.getValue("business_unit")}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const employeeId = row.original.id;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigate(`/employee/${employeeId}`)
                                }
                            >
                                View Employee
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};

export default function AllEmployee() {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState([]);
    const columns = getAllEmployeeHeader({ navigate });

    const {
        data: orgStructureData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["org-structure"],
        queryFn: getOrgStructure,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (orgStructureData) {
            const filteredData = orgStructureData.filter(
                (item) => item.name !== "OCEO",
            );
            setEmployeeData(filteredData);
        }
    }, [orgStructureData]);

    // Loading and error states
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading employee data.</div>;
    }

    // console.log(employeeData);

    return (
        <div className="mx-auto p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="w-full sm:w-auto mb-5 flex items-center justify-between">
                <Title title="All Employees" />
            </div>
            <div className="flex flex-col md:flex-row ">
                <div className="w-full">
                    <DataTable columns={columns} data={employeeData} />
                </div>
            </div>
        </div>
    );
}
