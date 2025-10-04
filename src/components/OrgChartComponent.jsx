// OrgChartComponent.tsx
import { useEffect, useRef } from "react";
import OrgChart from "@balkangraph/orgchart.js";

const OrgChartComponent = ({ orgData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = new OrgChart(chartRef.current, {
            template: "olivia", // nice template with avatars
            mouseScrool: OrgChart.action.zoom, // enable zooming
            orientation: OrgChart.isMobile()
                ? OrgChart.orientation.left
                : OrgChart.orientation.top,
            nodeBinding: {
                field_0: "name",
                field_1: "position_title",
            },
            searchFields: ["name"],
            nodes: orgData,
            collapse: { level: 2 },
            editForm: {
                generateElementsFromFields: false, // disable auto fields
                elements: [
                    { type: "textbox", label: "Name", binding: "name" },
                    {
                        type: "textbox",
                        label: "Position Title",
                        binding: "position_title",
                    },
                    {
                        type: "textbox",
                        label: "Active",
                        binding: "is_active",
                    },
                    {
                        type: "textbox",
                        label: "First Name",
                        binding: "firstname",
                    },
                    {
                        type: "textbox",
                        label: "Last Name",
                        binding: "lastname",
                    },
                    {
                        type: "textbox",
                        label: "Nickname",
                        binding: "nickname",
                    },
                ],
            },
        });

        // chart.onField(function (sender, args) {
        //     console.log(args);
        //     // if (args.field === "field_0") {
        //     //     args.value = "Name: " + args.value;
        //     // } else if (args.field === "field_1") {
        //     //     args.value = "Position Title: " + args.value;
        //     // }
        // });

        // // Responsive handling
        // chart.on("init", () => {
        //     // chart.fit(); // auto zoom to fit
        // });

        // const handleResize = () => chart.fit();
        // window.addEventListener("resize", handleResize);

        return () => {
            chart.destroy();
            //   window.removeEventListener("resize", handleResize);
        };
    }, [orgData]);

    return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default OrgChartComponent;
