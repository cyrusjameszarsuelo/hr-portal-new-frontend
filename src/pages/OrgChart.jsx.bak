import { useState } from "react";
import "../orgchart-custom.css";
import { OrganizationChart } from "primereact/organizationchart";
import { Dialog } from "primereact/dialog";
import functional_structure from "../store/functional_structure";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";

function OrgChart() {
    const [data] = useState(functional_structure);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [selectedParentIdx, setSelectedParentIdx] = useState(0);
    const navigate = useNavigate();

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        setShowDialog(true);
    };

    // Defensive: never spread props to DOM elements in nodeTemplate
    const nodeTemplate = (node) => {
        const isSelected = selectedNode && selectedNode.key === node.key;
        return (
            <div
                className={`orgchart-node${
                    isSelected ? " orgchart-node-selected" : ""
                }`}
                tabIndex={0}
                onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node);
                }}
            >
                <div className="orgchart-label">{node.label}</div>
                {node.title && (
                    <div
                        style={{
                            color: "#444",
                            fontWeight: 500,
                            fontSize: "1rem",
                            marginBottom: 4,
                        }}
                    >
                        {node.title}
                    </div>
                )}
                {node.department && (
                    <div
                        style={{
                            color: "#ee3124",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            marginBottom: 2,
                        }}
                    >
                        {node.department}
                    </div>
                )}
                {node.children && node.children.length > 0 && (
                    <div
                        className="orgchart-children"
                        style={{ fontSize: "0.9rem", color: "#888" }}
                    >
                        {node.children.length}{" "}
                        {node.children.length === 1
                            ? "subordinate"
                            : "subordinates"}
                    </div>
                )}
            </div>
        );
    };

    const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
    const handleReset = () => setZoom(1);

    return (
        <>
            <div
                className="card overflow-x-auto"
                style={{
                    minHeight: "95vh",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 8px 32px #ee312410",
                }}
            >
                {/* <div
                    style={{
                        position: "fixed",
                        top: "1.5rem",
                        right: "1.5rem",
                        zIndex: 1000,
                        background: "rgba(255,255,255,0.95)",
                        borderRadius: "2rem",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        padding: "0.5rem 1rem",
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        transition: "background 0.2s",
                        margin: "10px",
                    }}
                >
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        style={{
                            fontSize: "1.25rem",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            borderColor: "#ee3124",
                        }}
                    >
                        -
                    </button>
                    <span
                        style={{
                            minWidth: 48,
                            textAlign: "center",
                            fontWeight: 600,
                        }}
                    >
                        {(zoom * 100).toFixed(0)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 2}
                        style={{
                            fontSize: "1.25rem",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            borderColor: "#ee3124",
                        }}
                    >
                        +
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={zoom === 1}
                        style={{
                            fontSize: "1rem",
                            borderRadius: "1rem",
                            padding: "0 12px",
                        }}
                    >
                        Reset
                    </button>
                </div> */}
                <div
                    style={{
                        position: "fixed",
                        top: "5.5rem",
                        right: "1.5rem",
                        zIndex: 1000,
                        borderRadius: "2rem",
                        padding: "0.5rem 1rem",
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        transition: "background 0.2s",
                        margin: "10px",
                    }}
                >
                    <Button
                        onClick={() => navigate("/manage-function")}
                    label="Add Function"/>
                </div>
                <div
                    style={{
                        width: "100%",
                        maxWidth: 900,
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {/* Parent node selector */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: 24,
                            margin: "0 auto",
                            marginTop: "10rem",
                        }}
                    >
                        <div style={{ display: "flex", gap: 12 }}>
                            {data.map((parent, idx) => (
                                <button
                                    key={parent.key || idx}
                                    onClick={() => setSelectedParentIdx(idx)}
                                    style={{
                                        padding: "8px 50px",
                                        borderRadius: 8,
                                        border:
                                            selectedParentIdx === idx
                                                ? "2px solid #ee3124"
                                                : "1px solid #ccc",
                                        background:
                                            selectedParentIdx === idx
                                                ? "#ee3124"
                                                : "#fff",
                                        color:
                                            selectedParentIdx === idx
                                                ? "#fff"
                                                : "#222",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        boxShadow:
                                            selectedParentIdx === idx
                                                ? "0 2px 8px #ee312422"
                                                : "none",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {parent.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Only show the selected parent node's chart */}
                    <div
                        style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: "top center",
                            transition: "transform 0.2s",
                            minWidth: 320,
                            width: "fit-content",
                            maxWidth: "100%",
                            marginTop: "2rem",
                            height: "100%",
                        }}
                    >
                        <OrganizationChart
                            key={
                                data[selectedParentIdx]?.key ||
                                selectedParentIdx
                            }
                            value={[data[selectedParentIdx]]}
                            nodeTemplate={nodeTemplate}
                        />
                    </div>
                </div>
            </div>
            <Dialog
                header={selectedNode?.label}
                visible={showDialog}
                style={{ width: "100%", padding: "1rem" }}
                modal
                onHide={() => setShowDialog(false)}
            >
                {selectedNode && (
                    <div>
                        <p>
                            <strong>Node Key:</strong> {selectedNode.node}
                        </p>
                        <p>
                            <strong>Label:</strong> {selectedNode.label}
                        </p>
                        {selectedNode.children &&
                            selectedNode.children.length > 0 && (
                                <div>
                                    <strong>Detailed Description:</strong>
                                    <div>
                                        {selectedNode.children.map(
                                            (c, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-3"
                                                >
                                                    {c.label}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        {!selectedNode.children && (
                            <div style={{ overflowX: "auto" }}>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        minWidth: 600,
                                    }}
                                >
                                    <thead>
                                        <tr style={{ background: "#f3f4f6" }}>
                                            <th
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Deliverable
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Frequency Deliverable
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Responsible
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Accountable
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Support
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Consulted
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Informed
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {selectedNode.deliverable ||
                                                    "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {selectedNode.frequency_deliverable ||
                                                    "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {selectedNode.responsible ||
                                                    "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {selectedNode.accountable ||
                                                    "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {selectedNode.support || "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {selectedNode.consulted || "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #e5e7eb",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {selectedNode.informed || "-"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </>
    );
}

export default OrgChart;
