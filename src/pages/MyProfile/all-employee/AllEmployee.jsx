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
import { getOrgStructure } from "@/database/org_structure";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const BASE_URL = `${import.meta.env.VITE_API_URL}/storage/`;

const getAllEmployeeHeader = ({ navigate }) => {
    return [
        {
            accessorKey: "image",
            header: () => <div className="text-center m-4">Photo</div>,
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <div className="photo-wrapper p-2">
                        <img
                            className="lg:w-16 lg:h-16 w-full h-full rounded-full mx-auto object-cover"
                            src={
                                rowData?.image
                                    ? BASE_URL + rowData.image
                                    : undefined
                            }
                            alt="profile"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            accessorFn: (row) =>
                `${row.firstname ? row.firstname : ""} ${
                    row.lastname ? row.lastname : ""
                }`,
            header: ({ column }) => (
                <div className="text-center m-14 lg:m-0">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Name
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="capitalize font-medium m-2 text-center">
                    <h3 className="text-center font-bold text-gray-900 mb-2">
                        {row.original.firstname} {row.original.lastname}
                    </h3>
                    <div className="text-center text-gray-400 text-xs font-semibold">
                        <p>{row.original.position_title}</p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc",
                                )
                            }
                        >
                            Email
                            <ArrowUpDown />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium m-2 text-center">
                    <h3 className="text-center font-bold text-gray-900 mb-2">
                        {row.getValue("email")}
                    </h3>
                </div>
            ),
        },
        {
            accessorKey: "department",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Department
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-medium m-2 text-center">
                    <h3 className="text-center font-bold text-gray-900 mb-2">
                        {row.getValue("department")}
                    </h3>
                </div>
            ),
        },
        {
            accessorKey: "business_unit",
            header: ({ column }) => (
                <div className="text-center m-10">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Business Unit
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-medium m-2 text-center">
                    <h3 className="text-center font-bold text-gray-900 mb-2">
                        {row.getValue("business_unit")}
                    </h3>
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
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
                <div className="w-full ">
                    <DataTable columns={columns} data={employeeData} />
                </div>
            </div>
        </div>
    );
}
