import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import OrgChart from "../assets/js/orgchart.js";
import {
    addOrgNode,
    deleteOrgNode,
    updateOrgStructure,
    uploadImage,
} from "../database/org_structure.js";
import CustomModal from "./CustomModal";

const OrgChartComponent = ({ orgData, refetch }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const nodeIdToCenterOnRedraw = useRef(null); // New ref to store the ID for centering
    const BASE_URL = `${import.meta.env.VITE_API_URL}/storage/`;
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmNodeId, setConfirmNodeId] = useState(null);

    const processedOrgData = useMemo(() => orgData.map((node) => ({
        ...node,
        image: node.image ? BASE_URL + node.image : undefined,
        tags: ["redNode"],
        Department: node.department,
    })), [orgData, BASE_URL]);

    OrgChart.SEARCH_PLACEHOLDER = "Search for employee...";
    OrgChart.EDITFORM_CLOSE_BTN =
        '<div data-edit-from-close style="position: absolute; margin: 14px; font-size: 34px; text-align:right;  cursor: pointer;">' +
        OrgChart.icon.close(32, 32, "#ffffff") +
        "</div>";

    OrgChart.templates.filtered = Object.assign({}, OrgChart.templates.base);
    OrgChart.templates.filtered.size = [0, 0];
    OrgChart.templates.filtered.node = "";
    OrgChart.templates.filtered.field_0 = "";
    OrgChart.templates.filtered.img_0 = "";
    OrgChart.templates.filtered.link = "";
    OrgChart.templates.filtered.plus = ""; // Add this line
    OrgChart.templates.filtered.minus = ""; // Add this line

    OrgChart.templates.redTemplate = Object.assign({}, OrgChart.templates.ana);
    OrgChart.templates.redTemplate.node =
        '<rect x="0" y="0" height="120" rx="10" ry="10" width="250" fill="#231F20" stroke-width="1" stroke="#ee3124"></rect>';

    OrgChart.templates.redTemplate.field_0 =
        '<text data-width="230" data-text-overflow="multiline" ' +
        'style="font-size: 18px; fill: #dcdbdb;" ' +
        'x="125" y="98" text-anchor="middle">{val}</text>';

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
            chartInstance.current = null;
        }

        const chart = new OrgChart(chartRef.current, {
            mouseScrool: OrgChart.isMobile()
                ? window.matchMedia("(orientation: landscape)").matches
                    ? OrgChart.action.scroll // Mobile in landscape
                    : OrgChart.action.zoom // Mobile in portrait
                : OrgChart.action.ctrlZoom,
            enableDragDrop: true,
            orientation: OrgChart.isMobile()
                ? window.matchMedia("(orientation: landscape)").matches
                    ? OrgChart.orientation.top // Mobile in landscape
                    : OrgChart.orientation.left // Mobile in portrait
                : OrgChart.orientation.top, // Desktop (non-mobile)
            nodeBinding: {
                field_0: "name",
                field_1: "position_title",
                img_0: "image",
            },
            nodes: processedOrgData,
            collapse: { level: 2, allChildren: true },
            tags: {
                redNode: {
                    template: "redTemplate",
                },
                filter: { template: "filtered" },
            },
            nodeMenu: {
                add: {
                    text: "Add an Employee",
                    onClick: async function (nodeId) {
                        const response = await addOrgNode(nodeId);
                        const result = response.data;
                        chart.addNode({
                            id: result.id,
                            pid: result.pid,
                            name: result.name,
                            position_title: result.position_title,
                            business_unit: result.business_unit,
                            department: result.department,
                            level: result.level,
                            company: result.company,
                            email: result.email,
                            nickname: result.nickname,
                            image: "",
                            is_active: result.is_active,
                            firstname: result.firstname,
                            lastname: result.lastname,
                            reporting: result.reporting,
                            emp_no: result.emp_no,
                            tags: ["redNode"],
                            Department: result.department,
                        });
                    },
                },
            },
            filterBy: {
                Department: {},
            },
            enableSearch: false,
            editForm: {
                addMore: null,
                photoBinding: "image",
                buttons: {
                    share: null,
                    pdf: null,
                },
                generateElementsFromFields: false,
                elements: [
                    { type: "textbox", label: "Name", binding: "name" },
                    {
                        type: "textbox",
                        label: "Position Title",
                        binding: "position_title",
                    },
                    { type: "textbox", label: "Nickname", binding: "nickname" },
                    { type: "textbox", label: "Job Level", binding: "level" },
                    {
                        type: "textbox",
                        label: "Department",
                        binding: "department",
                    },
                    {
                        type: "textbox",
                        label: "Business Unit",
                        binding: "business_unit",
                    },
                    { type: "textbox", label: "Company", binding: "company" },
                    { type: "textbox", label: "Email", binding: "email" },
                    {
                        type: "textbox",
                        label: "Photo Url",
                        binding: "image",
                        btn: "Upload",
                    },
                ],
            },
        });

        chartInstance.current = chart;

        chart.on("init", () => {
            chart.fit();
            setIsExpanded(false);
            setTimeout(() => {
                if (chartInstance.current && chartInstance.current.filterUI) {
                    chartInstance.current.filterUI.hide();
                }
            }, 0);
        });

        // Store the node ID when the expand/collapse button is clicked
        chart.onExpandCollapseButtonClick(function (args) {
            nodeIdToCenterOnRedraw.current = args.id; // Store the ID
        });

        // Center the node AFTER the chart has finished redrawing
        chart.onRedraw(function () {
            if (nodeIdToCenterOnRedraw.current) {
                this.center(nodeIdToCenterOnRedraw.current, null, () => {
                    nodeIdToCenterOnRedraw.current = null;
                });
            }
        });

        chart.editUI.on("element-btn-click", function (sender, args) {
            OrgChart.fileUploadDialog(async function (file) {
                var formData = new FormData();
                formData.append("image", file);
                formData.append("id", args.nodeId);

                try {
                    const response = await uploadImage(formData);
                    const newImageUrl = BASE_URL + response.image_path;

                    const imageInput = chart.element.querySelector(
                        `input[data-binding="image"]`,
                    );
                    if (imageInput) {
                        imageInput.value = newImageUrl;
                        // Optionally, update the photo preview in the header if photoBinding is used
                        sender.setAvatar(newImageUrl);
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            });
        });

        chart.onUpdateNode(function (args) {
            const oldData = args.oldData;
            const newData = args.newData;
            console.log("Node Updated:", { oldData, newData });
            updateOrgStructure(newData);
            refetch();
        });

        chart.onRemoveNode(function (args) {
            const removedNodeId = args.id;
            // Open our custom confirmation modal instead of window.confirm
            setConfirmNodeId(removedNodeId);
            setIsConfirmOpen(true);
            // Return false to pause/remove until user confirms
            return false;
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [orgData, BASE_URL, refetch, processedOrgData]);

    // Confirm modal handlers
    const handleConfirmDelete = async () => {
        if (!confirmNodeId) return;
        try {
            await deleteOrgNode(confirmNodeId);
            setIsConfirmOpen(false);
            setConfirmNodeId(null);
            if (typeof refetch === "function") refetch();
            // If chart instance exists, remove node visually
            if (chartInstance.current) {
                chartInstance.current.removeNode(confirmNodeId);
            }
        } catch (err) {
            console.error("Failed to delete node", err);
            setIsConfirmOpen(false);
            setConfirmNodeId(null);
        }
    };

    const handleCancelDelete = () => {
        // setIsConfirmOpen(false);
        // setConfirmNodeId(null);
    };

    const handleToggleExpandCollapse = () => {
        if (!chartInstance.current) return;

        if (isExpanded) {
            const allNodeIds = Object.keys(chartInstance.current.nodes);
            const rootIds = chartInstance.current.roots.map((r) =>
                r.id.toString(),
            );

            const nodesToCollapseCompletely = allNodeIds.filter(
                (id) => !rootIds.includes(id.toString()),
            );

            chartInstance.current.expandCollapse(
                null,
                [],
                nodesToCollapseCompletely,
                () => {
                    if (rootIds.length > 0) {
                        chartInstance.current.center(rootIds[0]);
                    }
                    setIsExpanded(false);
                },
            );
        } else {
            chartInstance.current.expand(null, "all", () => {
                if (chartInstance.current.roots.length > 0) {
                    chartInstance.current.center(
                        chartInstance.current.roots[0].id,
                    );
                }
                setIsExpanded(true);
            });
        }
    };

    const handleSearchChange = useCallback((event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (
            chartInstance.current &&
            value.length >= (OrgChart.MINIMUM_SYMBOLS_IN_SEARCH_INPUT || 3)
        ) {
            const results = chartInstance.current.search(
                value,
                ["name", "position_title"],
                ["image"],
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
            if (chartInstance.current) {
                chartInstance.current.search("");
            }
        }
    }, []);

    const handleSearchResultClick = useCallback((nodeId) => {
        if (chartInstance.current) {
            chartInstance.current.center(nodeId);
            setSearchResults([]);
            setSearchTerm("");
            chartInstance.current.ripple(nodeId);
            chartInstance.current.editUI.show(nodeId, true);
        }
    }, []);

    return (
        <div>
            <CustomModal
                isOpen={isConfirmOpen}
                onClose={handleCancelDelete}
                title="Confirm delete"
            >
                <div className="p-4">
                    <p className="text-gray-700 mb-4">
                        Are you sure you want to delete this employee?
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={handleCancelDelete}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </CustomModal>
            <div style={{ marginBottom: "10px" }}>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-all duration-200 w-auto text-sm"
                    onClick={handleToggleExpandCollapse}
                    title={isExpanded ? "Collapse All" : "Expand All"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={
                                isExpanded
                                    ? "m4.5 15.75 7.5-7.5 7.5 7.5"
                                    : "m19.5 8.25-7.5 7.5-7.5-7.5"
                            }
                        />
                    </svg>
                    {isExpanded ? "Collapse All" : "Expand All"}
                </button>
            </div>

            <div
                style={{
                    top: "10px",
                    right: "10px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-end",
                }}
            >
                <div style={{ position: "relative", width: "250px" }}>
                    <input
                        type="text"
                        placeholder={OrgChart.SEARCH_PLACEHOLDER}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {searchResults.length > 0 && (
                        <ul
                            style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                backgroundColor: "white",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                maxHeight: "200px",
                                overflowY: "auto",
                                zIndex: 1001,
                                listStyle: "none",
                                padding: 0,
                                margin: "5px 0 0 0",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            }}
                        >
                            {searchResults.map((result) => (
                                <li
                                    key={result.id}
                                    onClick={() =>
                                        handleSearchResultClick(result.id)
                                    }
                                    style={{
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #eee",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                    className="hover:bg-gray-100"
                                >
                                    {result.image && (
                                        <img
                                            src={result.image}
                                            alt={result.name}
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                    <div>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    result.__searchMarks ||
                                                    result.name,
                                            }}
                                        />
                                        {result.position_title && (
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                }}
                                            >
                                                {result.position_title}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div
                ref={chartRef}
                style={{ width: "100%", position: "relative" }}
                className="org-chart"
            />
        </div>
    );
};

export default OrgChartComponent;
