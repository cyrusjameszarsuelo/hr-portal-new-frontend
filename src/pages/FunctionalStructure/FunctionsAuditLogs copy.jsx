import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAuditLogs } from "../../utils/audit_logs";
import Title from "../../components/Title";

// Helpers
const parsePossibleJson = (val) => {
    if (val == null) return null;
    if (typeof val === "object") return val;
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }
    return val;
};

const computeDiff = (oldObj, newObj) => {
    if (oldObj == null && newObj == null) return [];
    const isObjOld = oldObj && typeof oldObj === "object" && !Array.isArray(oldObj);
    const isObjNew = newObj && typeof newObj === "object" && !Array.isArray(newObj);
    if (!isObjOld || !isObjNew) {
        const a = oldObj == null ? "" : typeof oldObj === "string" ? oldObj : JSON.stringify(oldObj);
        const b = newObj == null ? "" : typeof newObj === "string" ? newObj : JSON.stringify(newObj);
        return a === b ? [] : [{ key: "value", old: a, new: b }];
    }

    const keys = Array.from(new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]));
    const diffs = [];
    for (const k of keys) {
        const ov = oldObj ? oldObj[k] : undefined;
        const nv = newObj ? newObj[k] : undefined;
        const ovStr = ov == null ? "" : typeof ov === "string" ? ov : JSON.stringify(ov);
        const nvStr = nv == null ? "" : typeof nv === "string" ? nv : JSON.stringify(nv);
        if (ovStr !== nvStr) diffs.push({ key: k, old: ovStr, new: nvStr });
    }
    return diffs;
};

const enrichAndFilter = (items = []) => {
    return items
        .map((log) => {
            const oldVal = parsePossibleJson(log.old_data);
            const newVal = parsePossibleJson(log.new_data);
            const diffs = computeDiff(oldVal, newVal);
            return { log, diffs };
        })
        .filter((x) => x.diffs && x.diffs.length > 0);
};

function AuditRow({ log, diffs }) {
    return (
        <tr className="odd:bg-white even:bg-gray-50 align-top">
            <td className="px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap">
                {new Date(log.created_at).toLocaleString()}
            </td>
            <td className="px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap">
                {log.user?.name ?? "-"}
            </td>
            <td className="px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap">
                {log.action}
            </td>
            <td className="px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap break-words max-w-[32rem]">
                {diffs.length ? (
                    <div className="space-y-1 text-xs">
                        {diffs.map((d) => (
                            <div key={d.key} className="font-mono text-xs text-gray-700">
                                <span className="font-semibold">{d.key}:</span> {d.old}
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-500">-</span>
                )}
            </td>
            <td className="px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap break-words max-w-[32rem]">
                {diffs.length ? (
                    <div className="space-y-1 text-xs">
                        {diffs.map((d) => (
                            <div key={d.key} className="font-mono text-xs text-gray-700">
                                <span className="font-semibold">{d.key}:</span> {d.new}
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-500">-</span>
                )}
            </td>
        </tr>
    );
}

export default function FunctionsAuditLogs() {
    const [logs, setLogs] = useState([]); // each item: { log, diffs }
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(null);
    const [error, setError] = useState(null);

    const extractItems = (res) => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.data)) return res.data;
        return Array.isArray(res.items) ? res.items : [];
    };

    // Fetch server pages starting at `startServerPage` and accumulate filtered items
    // until we have at most `perPage` items to display for a client page, or until
    // there are no more server pages. This handles the case where server-side pages
    // contain many items that are filtered out (no diffs).
    const fetchPage = useCallback(
        async (clientPage = 1) => {
            setLoading(true);
            setError(null);
            try {
                const collected = [];
                let serverPage = clientPage; // start fetching from the same numeric page
                let serverTotalPages = null;

                while (collected.length < perPage) {
                    const res = await getAuditLogs({ page: serverPage, per_page: perPage });
                    const items = extractItems(res);
                    // update totalPages if backend provides metadata
                    if (res && res.meta && typeof res.meta.total_pages === "number") {
                        serverTotalPages = res.meta.total_pages;
                        setTotalPages(serverTotalPages);
                    }
                    const enriched = enrichAndFilter(items);
                    collected.push(...enriched);

                    // stop if we've reached the server's last page or there are no more items
                    if (!items || items.length === 0) break;
                    if (serverTotalPages && serverPage >= serverTotalPages) break;
                    // if we already collected enough, break
                    if (collected.length >= perPage) break;
                    serverPage += 1; // fetch next server page
                }

                // Trim to at most perPage items for this client page
                const toShow = collected.slice(0, perPage);
                setLogs(toShow);
                setPage(clientPage);
            } catch (err) {
                console.error("Failed to fetch audit logs", err);
                setError(String(err));
            } finally {
                setLoading(false);
            }
        },
        [perPage],
    );

    useEffect(() => {
        fetchPage(1);
    }, [fetchPage]);

    const handlePageClick = useCallback((p) => fetchPage(p), [fetchPage]);

    const handleLoadMore = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // We'll start fetching from the next client page number, which corresponds
            // to server pages starting at (page + 1). Use the same accumulate-until-filled
            // strategy as fetchPage, then append results.
            const nextClient = page + 1;
            const collected = [];
            let serverPage = nextClient;
            let serverTotalPages = null;

            while (collected.length < perPage) {
                const res = await getAuditLogs({ page: serverPage, per_page: perPage });
                const items = extractItems(res);
                if (res && res.meta && typeof res.meta.total_pages === "number") {
                    serverTotalPages = res.meta.total_pages;
                    setTotalPages(serverTotalPages);
                }
                const enriched = enrichAndFilter(items);
                collected.push(...enriched);

                if (!items || items.length === 0) break;
                if (serverTotalPages && serverPage >= serverTotalPages) break;
                if (collected.length >= perPage) break;
                serverPage += 1;
            }

            if (collected.length > 0) {
                const toAppend = collected.slice(0, perPage);
                setLogs((prev) => [...prev, ...toAppend]);
                setPage(nextClient);
            }
        } catch (err) {
            console.error("Failed to load more audit logs", err);
            setError(String(err));
        } finally {
            setLoading(false);
        }
    }, [page, perPage]);

    const paginator = useMemo(() => {
        if (!totalPages) return null;
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        return (
            <div className="flex gap-2 items-center">
                {pages.map((p) => (
                    <button
                        key={p}
                        className={`px-3 py-1 rounded ${p === page ? "bg-black text-white" : "bg-gray-100"}`}
                        onClick={() => handlePageClick(p)}
                    >
                        {p}
                    </button>
                ))}
            </div>
        );
    }, [totalPages, page, handlePageClick]);

    return (
        <section className="w-auto p-6 bg-white rounded-lg shadow">
            <div className="mb-6 gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto">
                    <Title title="Functions Audit Logs" />
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-auto">
                        <table className="w-full table-auto min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-red-600 text-white">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Action</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Old</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">New</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {logs && logs.length > 0 ? (
                                    logs.map(({ log, diffs }) => (
                                        <AuditRow key={log.id ?? Math.random()} log={log} diffs={diffs} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-gray-600">
                                            {loading ? "Loading audit logs..." : error ? `Error: ${error}` : "No audit logs available."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="mt-4 flex items-center justify-between">
                        <div>{paginator}</div>
                        <div className="flex items-center gap-2">
                            {!totalPages && (
                                <button className="px-4 py-2 bg-gray-100 rounded" onClick={handleLoadMore} disabled={loading}>
                                    {loading ? "Loading..." : "Load more"}
                                </button>
                            )}
                            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="border rounded px-2 py-1">
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
