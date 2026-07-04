import React, { useEffect, useMemo, useState } from "react";
import { listOrders } from "../api/orders";
import { bucketForStatus, DASHBOARD_LABELS } from "../utils/workflow";
import "./Dashboard.css";

const BUCKET_ORDER = [
  "RECEIVED",
  "COOK",
  "PACK",
  "DELIVER",
  "RECEIVE",
  "COMPLETED",
  "FAILED",
  "EXPIRED",
];
const TIMED_STAGES = ["COOK", "PACK", "DELIVER", "RECEIVE"];

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setOrders(await listOrders());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    const c = Object.fromEntries(BUCKET_ORDER.map((b) => [b, 0]));
    orders.forEach((o) => {
      const bucket = bucketForStatus(o.status);
      c[bucket] = (c[bucket] || 0) + 1;
    });
    return c;
  }, [orders]);

  const averageDurations = useMemo(() => {
    const values = Object.fromEntries(TIMED_STAGES.map((stage) => [stage, []]));
    orders.forEach((order) => {
      (order.history || []).forEach((event) => {
        if (
          event.event === "COMPLETED" &&
          values[event.step] &&
          event.duration_seconds != null
        ) {
          values[event.step].push(Number(event.duration_seconds));
        }
      });
    });
    return Object.fromEntries(
      TIMED_STAGES.map((stage) => {
        const durations = values[stage];
        const average = durations.length
          ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
          : 0;
        return [stage, average];
      })
    );
  }, [orders]);

  return (
    <div className="dashboard-page">
      <h1 className="seccion-titulo">Dashboard</h1>

      {loading && <p className="estado-msg">Cargando pedidos...</p>}
      {error && <p className="estado-msg error">{error}</p>}

      {!loading && !error && (
        <div className="stats-grid">
          {BUCKET_ORDER.map((bucket) => (
            <div key={bucket} className="stat-card">
              <span className="stat-value">{counts[bucket]}</span>
              <span className="stat-label">{DASHBOARD_LABELS[bucket]}</span>
            </div>
          ))}
          <div className="stat-card total">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Total de pedidos</span>
          </div>
          {TIMED_STAGES.map((stage) => (
            <div key={`duration-${stage}`} className="stat-card">
              <span className="stat-value">{averageDurations[stage]}s</span>
              <span className="stat-label">
                Tiempo promedio: {DASHBOARD_LABELS[stage]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
