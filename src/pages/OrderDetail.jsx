import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder, taskCallback, deleteOrder } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { statusLabel } from "../utils/orderStatus";
import { formatPrice } from "../utils/format";
import { canCompleteStage, matchesStage, BOARD_COLUMNS } from "../utils/workflow";
import "./OrderDetail.css";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const data = await getOrder(orderId);
      setOrder(data.order || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const currentColumn = order
    ? BOARD_COLUMNS.find((c) => matchesStage(order, c.stage))
    : null;

  const handleComplete = async () => {
    if (!currentColumn) return;
    setBusy(true);
    setError("");
    try {
      await taskCallback({
        order_id: order.order_id,
        taskToken: order.task_token,
        workflow_step: currentColumn.stage,
        status: "COMPLETED",
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este pedido? Esta acción no se puede deshacer.")) return;
    setBusy(true);
    setError("");
    try {
      await deleteOrder(order.order_id);
      navigate("/pedidos");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (loading) return <p className="estado-msg">Cargando pedido...</p>;
  if (error && !order) return <p className="estado-msg error">{error}</p>;
  if (!order) return null;

  const total = (order.items || []).reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="order-detail-page">
      <button className="back-link" onClick={() => navigate(-1)}>← Volver</button>

      <div className="order-detail-card">
        <div className="order-detail-header">
          <h1>Pedido #{order.order_id.slice(0, 8)}</h1>
          <span className="order-detail-status">{statusLabel(order.status)}</span>
        </div>

        <p className="order-detail-meta">
          Origen: {order.source || "—"} · Creado por: {order.created_by || "—"} ·{" "}
          {order.created_at ? new Date(order.created_at).toLocaleString("es-PE") : "—"}
        </p>

        <div className="order-detail-section">
          <h3>Items</h3>
          <div className="order-items-list">
            {(order.items || []).map((item, i) => (
              <div key={i} className="order-item-row">
                <span>{item.quantity}x {item.name || item.product_id}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="order-total-row">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="order-detail-section">
          <h3>Historial</h3>
          {(order.history || []).length === 0 && (
            <p className="estado-msg">Sin eventos registrados.</p>
          )}
          <div className="history-list">
            {(order.history || []).map((h, i) => (
              <div key={i} className="history-row">
                <span className="history-step">{h.step || h.workflow_step || h.action || "—"}</span>
                <span className="history-actor">{h.actor || h.by || "—"}</span>
                <span className="history-time">
                  {h.timestamp ? new Date(h.timestamp).toLocaleString("es-PE") : (h.at || "—")}
                </span>
                {h.duration_seconds != null && (
                  <span className="history-duration">{h.duration_seconds}s</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="estado-msg error">{error}</p>}

        <div className="order-detail-actions">
          {currentColumn && canCompleteStage(user.role, currentColumn.stage) && order.task_token && (
            <button className="btn-primario" onClick={handleComplete} disabled={busy}>
              {busy ? "Procesando..." : `Completar ${currentColumn.label.toLowerCase()}`}
            </button>
          )}
          {currentColumn && canCompleteStage(user.role, currentColumn.stage) && !order.task_token && (
            <p className="estado-msg">
              Este pedido aún no tiene una tarea asignada para esta etapa; no se puede completar todavía.
            </p>
          )}
          {user.role === "admin" && (
            <button className="btn-peligro" onClick={handleDelete} disabled={busy}>
              Eliminar pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
