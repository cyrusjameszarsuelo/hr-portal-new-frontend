import { useNavigate } from "react-router";
import { capitalizeFirstLetter } from "../helper/capitalizedFirstLetter";
import Title from "./Title";
import { Button } from "./ui/button";
import { formatDate } from "@/helper/dateFormat";

// Utility helpers

function safeParse(value) {
    if (value && typeof value === "object") return value;
    if (typeof value !== "string") return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

function formatValue(value) {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "object") return JSON.stringify(value);

    // Check if value is a date string (ISO format or common date patterns)
    const datePattern = /^\d{4}-\d{2}-\d{2}(T|\s|$)/;
    if (typeof value === "string" && datePattern.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return formatDate(value);
        }
    }

    return String(value);
}

function getChangedFields(oldRaw, newRaw) {
    // Parse JSON if needed, then compare keys and return an object with only changed keys
    const oldData = safeParse(oldRaw) || {};
    const newData = safeParse(newRaw) || {};

    // If both are non-objects (primitive strings etc), compare directly
    const oldIsObj =
        oldData && typeof oldData === "object" && !Array.isArray(oldData);
    const newIsObj =
        newData && typeof newData === "object" && !Array.isArray(newData);

    if (!oldIsObj || !newIsObj) {
        // Fallback: treat as primitives; if different, show both under a single key
        if (String(oldData) !== String(newData))
            return { value: { old: oldData, new: newData } };
        return {}; // no changes
    }

    const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
    const changed = {};
    keys.forEach((k) => {
        const a = oldData[k];
        const b = newData[k];
        // Treat undefined and null similarly for comparison
        const aStr = a === undefined ? "" : JSON.stringify(a);
        const bStr = b === undefined ? "" : JSON.stringify(b);
        if (aStr !== bStr) changed[k] = { old: a, new: b };
    });

    return changed;
}

export default function AuditLogs({
    logs,
    loading,
    error,
    serverPage,
    setServerPage,
    totalPages,
    setPerPage,
    perPage,
    title,
}) {
    const navigate = useNavigate();
    // Renderers for old / new columns that only show the changed fields
    function OldColumn({ oldData, newData }) {
        const changed = getChangedFields(oldData, newData);
        const entries = Object.entries(changed);
        if (entries.length === 0) return <span>-</span>;

        return (
            <div className="flex flex-col gap-1">
                {entries.map(([key, payload]) => {
                    const old =
                        payload && payload.old !== undefined
                            ? payload.old
                            : null;
                    return (
                        <div key={key} className="text-sm">
                            <div className="font-mono text-xs text-gray-500">
                                {capitalizeFirstLetter(key)}
                            </div>
                            <div className="text-gray-700">
                                {formatValue(old)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    function NewColumn({ oldData, newData }) {
        const changed = getChangedFields(oldData, newData);
        const entries = Object.entries(changed);
        if (entries.length === 0) return <span>-</span>;

        return (
            <div className="flex flex-col gap-1">
                {entries.map(([key, payload]) => {
                    const newest =
                        payload && payload.new !== undefined
                            ? payload.new
                            : null;
                    return (
                        <div key={key} className="text-sm">
                            <div className="font-mono text-xs text-gray-500">
                                {capitalizeFirstLetter(key)}
                            </div>
                            <div className="text-gray-700">
                                {formatValue(newest)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <section>
            <div className="w-auto p-6 bg-white rounded-lg shadow">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full sm:w-auto">
                        <Title title={title} />
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <select
                            className="border rounded px-2 py-1"
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setServerPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div> */}
                </div>

                <div className="overflow-x-auto mt-4">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200 table-auto">
                                <thead className="bg-[#ee3124]">
                                    <tr>
                                        {/* <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-semibold text-white uppercase"
                                        >
                                            Date
                                        </th> */}
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-semibold text-white uppercase"
                                        >
                                            User
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-semibold text-white uppercase"
                                        >
                                            Action
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-semibold text-white uppercase"
                                        >
                                            Old
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-semibold text-white uppercase"
                                        >
                                            New
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="p-6 text-center"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="p-6 text-center text-red-600"
                                            >
                                                Error: {error}
                                            </td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="p-6 text-center"
                                            >
                                                No audit logs.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log, rowIndex) => {
                                            const key =
                                                log.id ??
                                                `${
                                                    log.action
                                                }-${Math.random()}`;
                                            const rowClass =
                                                rowIndex % 2 === 0
                                                    ? "bg-white hover:bg-red-50"
                                                    : "bg-gray-100 hover:bg-red-50";
                                            return (
                                                <tr
                                                    key={key}
                                                    className={rowClass}
                                                >
                                                    {/* <td className="px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap">
                                                        {formatDate(
                                                            log.created_at,
                                                        )}
                                                    </td> */}
                                                    <td className="px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap">
                                                        {log.user?.name ?? "-"}
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap">
                                                        {log.action}
                                                    </td>
                                                    <td className="px-4 py-3 align-top text-sm text-gray-700">
                                                        <OldColumn
                                                            oldData={
                                                                log.old_data
                                                            }
                                                            newData={
                                                                log.new_data
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 align-top text-sm text-gray-700">
                                                        <NewColumn
                                                            oldData={
                                                                log.old_data
                                                            }
                                                            newData={
                                                                log.new_data
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Previous page"
                            className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md shadow-sm border ${
                                serverPage <= 1 || loading
                                    ? "bg-gray-50 text-gray-400 border-gray-200 opacity-60 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                            }`}
                            onClick={() =>
                                setServerPage((p) => Math.max(1, p - 1))
                            }
                            disabled={serverPage <= 1 || loading}
                        >
                            Prev
                        </button>
                        <span className="px-4 py-3 border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap">
                            Page {serverPage}
                            {totalPages ? ` / ${totalPages}` : ""}
                        </span>
                        <button
                            aria-label="Next page"
                            className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md shadow-sm border ${
                                totalPages != null && serverPage >= totalPages
                                    ? "bg-gray-50 text-gray-400 border-gray-200 opacity-60 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                            }`}
                            onClick={() => setServerPage((p) => p + 1)}
                            disabled={
                                totalPages != null && serverPage >= totalPages
                            }
                        >
                            Next
                        </button>
                    </div>
                    <div>
                        <button
                            className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md shadow-sm ${
                                loading
                                    ? "bg-gray-500 text-white opacity-70 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800"
                            }`}
                            onClick={() => {
                                setServerPage(1);
                                setPerPage(perPage);
                            }}
                            disabled={loading}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
