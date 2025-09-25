import React, { useEffect, useRef, useState } from "react";
import OrgChart from "@balkangraph/orgchart.js";

export default function OrgChartWithModalDebug() {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // ensure DOM ready
        if (!containerRef.current) return;

        // create chart
        const chart = new OrgChart(containerRef.current, {
            nodes: [
                { id: 1, name: "Alice", title: "CEO", department: "Executive" },
                {
                    id: 2,
                    pid: 1,
                    name: "Bob",
                    title: "CTO",
                    department: "Tech",
                },
                {
                    id: 3,
                    pid: 1,
                    name: "Charlie",
                    title: "CFO",
                    department: "Finance",
                },
            ],
            nodeBinding: { field_0: "name", field_1: "title" },
            template: "olivia",
            enableDragDrop: false,
            nodeMenu: {}, // disable right-click menu
        });

        chartRef.current = chart;

        // safe-hide built-in side editor (wrap in try so it won't crash if not present)
        try {
            chart.editUI &&
                typeof chart.editUI.hide === "function" &&
                chart.editUI.hide();
        } catch (err) {
            console.warn("editUI.hide() threw:", err);
        }

        // debug: ensure chart was created
        console.log("OrgChart instance created:", chart);

        // bind click (debugging logs included)
        chart.on("click", (sender, args) => {
            console.log("orgchart click event args:", args);

            // args.node can be different shapes depending on version — try common fallbacks
            const nodeId =
                args?.node?.id ?? // object with id
                args?.node ?? // node could be id already
                args?.nodeId ?? // alternative name
                args?.id; // fallback

            console.log("resolved nodeId:", nodeId);

            let data = null;
            try {
                data =
                    typeof chart.get === "function" ? chart.get(nodeId) : null;
            } catch (err) {
                console.error("chart.get threw:", err);
            }
            console.log("chart.get returned:", data);

            // set something so modal shows even if chart.get returned undefined
            setSelectedNode(data || { id: nodeId, _rawArgs: args });
            setIsModalOpen(true);

            // try to stop default side panel
            return false;
        });

        // cleanup
        return () => {
            try {
                chart.destroy && chart.destroy();
            } catch (e) {
                console.log(e);
            }
        };
    }, []);

    return (
        <div>
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: 600,
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
                        pointerEvents: "auto",
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: 20,
                            borderRadius: 8,
                            minWidth: 320,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        }}
                    >
                        <h3 style={{ margin: 0 }}>
                            {selectedNode.name ?? `Id: ${selectedNode.id}`}
                        </h3>
                        <p style={{ margin: "6px 0 0" }}>
                            {selectedNode.title}
                        </p>
                        <p style={{ margin: "6px 0 0", color: "#666" }}>
                            Dept: {selectedNode.department ?? "—"}
                        </p>

                        <details style={{ marginTop: 10 }}>
                            <summary style={{ cursor: "pointer" }}>
                                Raw node data
                            </summary>
                            <pre
                                style={{
                                    maxHeight: 200,
                                    overflow: "auto",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {JSON.stringify(selectedNode, null, 2)}
                            </pre>
                        </details>

                        <div style={{ marginTop: 12, textAlign: "right" }}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ padding: "6px 12px" }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
