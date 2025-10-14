import { useEffect, useRef, useState } from "react"; // Import useState
import OrgChart from "../assets/js/orgchart.js";
import {
    addOrgNode,
    deleteOrgNode,
    updateOrgStructure,
} from "../utils/org_structure";

const OrgChartComponent = ({ orgData }) => {
    console.log(OrgChart.isTrial() ? "Trial Version" : "Full Version");
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false); // Add state for expand/collapse
    const BASE_URL = "http://192.168.100.125:8000/storage/";

    // Map orgData and add Department field for filtering
    const processedOrgData = orgData.map((node) => ({
        ...node,
        // name: `${node.firstname} ${node.lastname}`, // Uncomment if you want to use this for name
        image: node.image ? BASE_URL + node.image : undefined,
        tags: ["redNode"],
        Department: node.department, // Use "Department" with capital D for filtering display
    }));

    OrgChart.SEARCH_PLACEHOLDER = "Search for employee...";

    OrgChart.templates.filtered = Object.assign({}, OrgChart.templates.base);
    OrgChart.templates.filtered.size = [0, 0]; // invisible
    OrgChart.templates.filtered.node = ""; // no shape
    OrgChart.templates.filtered.field_0 = ""; // no text
    OrgChart.templates.filtered.img_0 = ""; // no image

    OrgChart.templates.redTemplate = Object.assign({}, OrgChart.templates.ana);
    OrgChart.templates.redTemplate.node =
        '<rect x="0" y="0" height="120" rx="10" ry="10" width="250" fill="#231F20" stroke-width="1" stroke="#ee3124"></rect>';

    OrgChart.templates.redTemplate.field_0 =
        '<text data-width="230" data-text-overflow="multiline" ' +
        'style="font-size: 18px; fill: #dcdbdb;" ' + // 👈 text color here
        'x="125" y="98" text-anchor="middle">{val}</text>';

    useEffect(() => {
        if (!chartRef.current) return;

        // Destroy existing chart instance before creating a new one if orgData changes
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
            nodes: processedOrgData, // Use processedOrgData
            collapse: { level: 2, allChildren: true }, // Chart starts collapsed
            tags: {
                blueNode: {
                    template: "blueTemplate",
                },
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
                            Department: result.department, // Ensure new nodes also have 'Department'
                        });
                    },
                },
            },
            filterBy: {
                // Use "Department" here to match the processed data and desired display
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
            // Since collapse is set to level 2, the chart starts collapsed.
            // So, set isExpanded to false initially.
            setIsExpanded(false);
        });

        // This is no longer needed if you use "Department" directly in filterBy
        // chart.filterUI.on("add-filter", function (sender, args) {
        //     if (args.name === "department") {
        //         args.text = "Department";
        //     }
        // });

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
    }, [orgData]);

    // Handler to toggle expand/collapse all nodes
    const handleToggleExpandCollapse = () => {
        if (!chartInstance.current) return;

        if (isExpanded) {
            // Collapse all nodes
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
                    setIsExpanded(false); // Update state to collapsed
                },
            );
        } else {
            // Expand all nodes
            chartInstance.current.expand(null, "all", () => {
                if (chartInstance.current.roots.length > 0) {
                    chartInstance.current.center(
                        chartInstance.current.roots[0].id,
                    );
                }
                setIsExpanded(true); // Update state to expanded
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
