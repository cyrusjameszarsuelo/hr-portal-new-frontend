import { useEffect, useRef, useState } from "react";
import OrgChart from "@balkangraph/orgchart.js";

export default function OrgChartComponent({ data }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);

    const [selectedNode, setSelectedNode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !data) return;

        const chart = new OrgChart(containerRef.current, {
            nodes: data,
            nodeBinding: { field_0: "name", field_1: "title" },
            template: "ana",
            enableDragDrop: false,
            collapse: { level: 1 },
        });

        chartRef.current = chart;

        // Hide the built-in editor panel
        try {
            chart.editUI &&
                typeof chart.editUI.hide === "function" &&
                chart.editUI.hide();
        } catch (err) {
            console.warn("editUI.hide() threw:", err);
        }

        // Custom modal logic
        chart.on("click", (sender, args) => {
            const nodeId =
                args?.node?.id ?? args?.node ?? args?.nodeId ?? args?.id;

            let nodeData = null;
            try {
                nodeData =
                    typeof chart.get === "function" ? chart.get(nodeId) : null;
            } catch (err) {
                console.error("chart.get threw:", err);
            }

            setSelectedNode(nodeData || { id: nodeId });
            setIsModalOpen(true);

            return false; // prevent default behavior
        });

        return () => {
            chart.destroy && chart.destroy();
        };
    }, [data]); // re-render if data changes

    return (
        <div>
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "100vh",
                    border: "1px solid #eee",
                    marginBottom: 12,
                }}
            />

            {isModalOpen && selectedNode && (
                <div
                    style={{
                        position: "fixed",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 99999,
                    }}
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: 20,
                            borderRadius: 8,
                            minWidth: 320,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>{selectedNode.name ?? `Id: ${selectedNode.id}`}</h3>
                        <p>{selectedNode.title}</p>
                        <p>Dept: {selectedNode.department ?? "—"}</p>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ marginTop: 12 }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
