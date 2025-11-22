import { useEffect, useRef, useState, useMemo } from "react";
import OrgChart from "../assets/js/orgchart.js"; // Assuming this path is correct
import {
    addOrgNode,
    deleteOrgNode,
    updateOrgStructure,
} from "../database/org_structure.js";

const OrgChartComponent = ({ orgData }) => {
    console.log(OrgChart.isTrial() ? "Trial Version" : "Full Version");
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const BASE_URL = `${import.meta.env.VITE_API_URL}/storage/`;

    const processedOrgData = useMemo(() => orgData.map((node) => ({
        ...node,
        image: node.image ? BASE_URL + node.image : undefined,
        tags: ["redNode"],
        Department: node.department,
    })), [orgData, BASE_URL]);

    OrgChart.SEARCH_PLACEHOLDER = "Search for employee...";

    OrgChart.templates.filtered = Object.assign({}, OrgChart.templates.base);
    OrgChart.templates.filtered.size = [0, 0];
    OrgChart.templates.filtered.node = "";
    OrgChart.templates.filtered.field_0 = "";
    OrgChart.templates.filtered.img_0 = "";

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
            mouseScrool: OrgChart.action.zoom,
            orientation: OrgChart.isMobile()
                ? OrgChart.orientation.left
                : OrgChart.orientation.top,
            nodeBinding: {
                field_0: "name",
                field_1: "position_title",
                img_0: "image",
            },
            searchFields: ["name", "position_title"],
            nodes: processedOrgData,
            collapse: { level: 2, allChildren: true },
            tags: {
                blueNode: {
                    template: "blueTemplate",
                },
                redNode: {
                    template: "redTemplate",
                },
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
                // Ensure this is UNCOMMENTED for the filter UI to exist
                Department: {},
            },
            editForm: {
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
                ],
            },
        });

        chartInstance.current = chart;

        chart.on("init", () => {
            chart.fit();
            setIsExpanded(false);

            // Use a small setTimeout to ensure all UI elements are fully rendered and attached
            setTimeout(() => {
                let searchElement = chart.searchUI.element; // Attempt standard access first
                const filterElement = chart.filterUI.element;

                // Fallback: If chart.searchUI.element is undefined, try to find it by common class/attribute
                if (!searchElement && chartRef.current) {
                    // Common class names for the search input or its container
                    searchElement =
                        chartRef.current.querySelector(".boc-search") ||
                        chartRef.current.querySelector("[data-search]");
                    if (searchElement) {
                        console.log(
                            "Found search element via querySelector:",
                            searchElement,
                        );
                    }
                }

                console.log(
                    "searchElement after timeout and fallback:",
                    searchElement,
                );
                console.log("filterElement after timeout:", filterElement);

                if (searchElement && filterElement) {
                    const spacing = 10; // Desired vertical spacing between them

                    // Get the computed styles to understand their current positioning
                    const computedSearchStyle =
                        window.getComputedStyle(searchElement);
                    const currentSearchRight = computedSearchStyle.right;

                    const filterHeight = filterElement.offsetHeight;

                    let filterTop;
                    let searchTop;

                    if (OrgChart.isMobile()) {
                        filterTop = 10; // Start filter at 10px from top of container
                        searchTop = filterTop + filterHeight + spacing; // Place search below filter
                    } else {
                        // For desktop, use the original search bar's top as a reference
                        const initialDesktopTop =
                            parseFloat(computedSearchStyle.top) || 10;
                        filterTop = initialDesktopTop; // Filter takes search's original top
                        searchTop = filterTop + filterHeight + spacing; // Search moves below filter
                    }

                    // Apply styles to the filter element
                    filterElement.style.position = "absolute";
                    filterElement.style.top = `${filterTop}px`;
                    filterElement.style.right = currentSearchRight;
                    filterElement.style.zIndex = "1001"; // Ensure filter is on top

                    // Apply styles to the search element
                    searchElement.style.position = "absolute";
                    searchElement.style.top = `${searchTop}px`;
                    searchElement.style.right = currentSearchRight;
                    searchElement.style.zIndex = "1000"; // Ensure search is below filter
                } else {
                    console.warn(
                        "OrgChart UI elements (search or filter) not found for positioning. Ensure 'enableSearch' and 'filterBy' options are active and elements are rendered.",
                    );
                }
            }, 0); // A 0ms timeout defers execution to the next event loop tick
        });

        chart.onUpdateNode(function (args) {
            const oldData = args.oldData;
            const newData = args.newData;
            console.log("Node Updated:", { oldData, newData });
            updateOrgStructure(newData);
        });

        chart.onRemoveNode(function (args) {
            const removedNode = args;
            deleteOrgNode(removedNode.id);
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [processedOrgData]);

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

    return (
        <div>
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
            <div ref={chartRef} />
        </div>
    );
};

export default OrgChartComponent;
