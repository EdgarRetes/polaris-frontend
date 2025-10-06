import { useEffect, useState } from "react";
import AuditLog from "@/types/AuditLogDto";
import { AuditLogsTable } from "./components/AuditLogsTable";
import { getAuditLogs } from "@/services/auditService";

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando logs...</p>;

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Historial</h1>
      <AuditLogsTable data={logs} />
    </div>
  );
}
