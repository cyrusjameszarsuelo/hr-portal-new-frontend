import React from "react";

/**
 * DynamicTable renders a table for deliverable data (RACI table)
 * @param {Object} props
 * @param {Object} props.data - The data object with deliverable info
 */
export default function DynamicTable({ data }) {
    return (
        <div style={{ overflowX: "auto" }}>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 900,
                }}
            >
                <colgroup>
                    <col style={{ width: "140px" }} />
                    <col style={{ width: "140px" }} />
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "120px" }} />
                </colgroup>
                <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                        <th style={{ padding: "8px 12px", border: "1px solid #e5e7eb", fontWeight: 700 }}>Deliverable</th>
                        <th style={{ padding: "8px 12px", border: "1px solid #e5e7eb", fontWeight: 700 }}>Frequency of Deliverables</th>
                        <th style={{ padding: "8px 12px", border: "1px solid #e5e7eb", fontWeight: 700 }}>Responsible</th>
                        <th style={{ padding: "8px 12px", border: "1px solid #e5e7eb", fontWeight: 700 }}>Accountable</th>
                        <th style={{ padding: "8px 12px", border: "1px solid #e5e7eb", fontWeight: 700 }}>Support</th>
                        <th style={{ padding: "8px 12px", border: "1px solid #e5e7eb", fontWeight: 700 }}>Consulted</th>
                        <th style={{ padding: "8px 12px", border: "1px solid #e5e7eb", fontWeight: 700 }}>Informed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{data.deliverable || "-"}</td>
                        <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{data.frequency_deliverable || "-"}</td>
                        <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{data.responsible || "-"}</td>
                        <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{data.accountable || "-"}</td>
                        <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{data.support || "-"}</td>
                        <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{data.consulted || "-"}</td>
                        <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{data.informed || "-"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}