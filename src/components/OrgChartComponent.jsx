// OrgChartComponent.tsx
import { useEffect, useRef } from "react";
import OrgChart from "@balkangraph/orgchart.js";
import {
    addOrgNode,
    deleteOrgNode,
    updateOrgStructure,
} from "../utils/org_structure";

const OrgChartComponent = ({ orgData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const BASE_URL = "http://192.168.100.125:8000/storage/";

    orgData = orgData.map((node) => ({
        ...node,
        // name: `${node.firstname} ${node.lastname}`,
        image: node.image ? BASE_URL + node.image : undefined,
        tags: ["redNode"],
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

        const chart = new OrgChart(chartRef.current, {
            // template: "diva", // nice template with avatars
            mouseScrool: OrgChart.action.zoom, // enable zooming
            orientation: OrgChart.isMobile()
                ? OrgChart.orientation.left
                : OrgChart.orientation.top,
            nodeBinding: {
                field_0: "name",
                field_1: "position_title",
                img_0: "image",
            },
            searchFields: ["name", "position_title"],
            nodes: orgData,
            collapse: { level: 2, allChildren: true },
            tags: {
                blueNode: {
                    template: "blueTemplate",
                },
                redNode: {
                    template: "redTemplate",
                },
                // filter: { template: "filtered" },
            },
            nodeMenu: {
                add: {
                    text: "Add Child Node",
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
                        });
                    },
                },
            },
            // filterBy: {
            //     // position_title: {
            //     //     "Chairman & CEO": { checked: true, text: "Chairman & CEO" },
            //     // },
            //     // name: {
            //     //     "Edgar Saavedra": { checked: true, text: "Edgar Saavedra" },
            //     // },
            //     department: {},
            // },
            editForm: {
                photoBinding: "image",
                buttons: {
                    share: null,
                    pdf: null,
                    // edit: null,
                },
                generateElementsFromFields: false, // disable auto fields
                elements: [
                    {
                        type: "textbox",
                        label: "Name",
                        binding: "name",
                    },
                    {
                        type: "textbox",
                        label: "Position Title",
                        binding: "position_title",
                    },
                    {
                        type: "textbox",
                        label: "Nickname",
                        binding: "nickname",
                    },
                    {
                        type: "textbox",
                        label: "Job Level",
                        binding: "level",
                    },
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
                    {
                        type: "textbox",
                        label: "Company",
                        binding: "company",
                    },
                    {
                        type: "textbox",
                        label: "Email",
                        binding: "email",
                    },
                ],
            },
        });

        chartInstance.current = chart;

        // chart.filterUI.on("update", function () {
        //     chart.expand(null, "all");
        // });

        // Define templates
        // OrgChart.templates.blueTemplate = Object.assign(
        //     {},
        //     OrgChart.templates.olivia,
        // );
        // OrgChart.templates.blueTemplate.node =
        //     '<rect x="0" y="0" height="120" width="250" fill="#3498db" stroke-width="1" stroke="#aeaeae"></rect>';

        // OrgChart.templates.redTemplate.field_0 =
        //     '<text style="fill: white;">{val}</text>';

        // // Field_1 (Position) style
        // OrgChart.templates.greenTemplate.field_1 =
        //     '<text style="fill: white;">{val}</text>';

        // Responsive handling
        chart.on("init", () => {
            chart.fit(); // auto zoom to fit
            // const filterElement = chart.filterUI.element;

            // // Apply custom margin styles
            // if (filterElement) {
            //     filterElement.style.marginTop = "50px";
            //     filterElement.style.marginLeft = "10px";
            //     filterElement.style.marginRight = "10px";
            //     // Or use shorthand: filterElement.style.margin = '50px 10px';
            // }
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

        // const handleResize = () => chart.fit();
        // window.addEventListener("resize", handleResize);

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [orgData]);

    // Handler to expand all nodes
    const handleExpandAll = () => {
        if (chartInstance.current) {
            // 'null' for the first argument means no specific node to center on.
            // 'all' for the second argument expands all nodes.
            chartInstance.current.expand(null, "all");
            chartInstance.current.center(1); // Center the chart after expanding
            // chartInstance.current.fit();
        }
    };

    // Handler to collapse all nodes
    const handleCollapseAll = () => {
        if (chartInstance.current) {
            const allNodeIds = Object.keys(chartInstance.current.nodes);
            const rootIds = chartInstance.current.roots.map((r) =>
                r.id.toString(),
            );

            // Get all node IDs that are NOT root nodes. These are the nodes we want to collapse.
            const nodesToCollapseCompletely = allNodeIds.filter(
                (id) => !rootIds.includes(id.toString()),
            );

            // Use expandCollapse: expand an empty array, collapse all non-root nodes.
            // The first argument (node that won't move) can be null for a general action.
            chartInstance.current.expandCollapse(
                null,
                [],
                nodesToCollapseCompletely,
            );
            // chartInstance.current.fit(); // Optional: Fit the chart to the container
            chartInstance.current.center(rootIds[0]);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button
                    onClick={handleExpandAll}
                    className="px-3 py-2 bg-[#231F20] text-white rounded m-1"
                >
                    Expand All
                </button>
                <button
                    onClick={handleCollapseAll}
                    className="px-3 py-2 bg-[#ee3124] text-white rounded m-1"
                >
                    Collapse All
                </button>
            </div>
            <div ref={chartRef} />
        </div>
    );
};

export default OrgChartComponent;
