import { useEffect, useState } from "react";
import { getFunctionAuditLogs } from "../../utils/audit_logs";
import AuditLogs from "../../components/AuditLog";

export default function FunctionsAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [serverPage, setServerPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        getFunctionAuditLogs({ page: serverPage, per_page: perPage })
            .then((res) => {
                if (!active) return;
                let items = [];
                if (!res) items = [];
                else if (Array.isArray(res)) items = res;
                else if (Array.isArray(res.data)) items = res.data;
                else if (Array.isArray(res.items)) items = res.items;
                setLogs(items);
                if (res && res.meta && typeof res.meta.total_pages === "number")
                    setTotalPages(res.meta.total_pages);
            })
            .catch((e) => {
                if (active) setError(String(e));
            })
            .finally(() => active && setLoading(false));

        return () => (active = false);
    }, [serverPage, perPage]);

    return (
        <AuditLogs
            logs={logs}
            loading={loading}
            error={error}
            serverPage={serverPage}
            setServerPage={setServerPage}
            totalPages={totalPages}
            setPerPage={setPerPage}
            perPage={perPage}
            title="Functions Audit Logs"
        />
    );
}
