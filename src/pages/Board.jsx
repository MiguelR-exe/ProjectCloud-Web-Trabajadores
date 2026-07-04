import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders, taskCallback } from "../api/orders";
import { listProducts } from "../api/products";
import { useAuth } from "../context/AuthContext";
import { columnsForRole, matchesStage, canCompleteStage } from "../utils/workflow";
import { formatPrice } from "../utils/format";
import "./Board.css";

export default function Board() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(null);

  const columns = columnsForRole(user.role);
  const canComplete = canCompleteStage(user.role);

  const loadOrders = async () => {
    const data = await listOrders();
    setOrders(data);
  };

  useEffect(() => {
    (async () => {
      try {
        const [, products] = await Promise.all([loadOrders(), listProducts()]);
        setProductImages(
          Object.fromEntries(products.map((p) => [p.product_id, p.image_url]))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = async (order, stage) => {
    setCompleting(order.order_id);
    setError("");
    try {
      await taskCallback({
        order_id: order.order_id,
        taskToken: order.task_token,
        workflow_step: stage,
        status: "COMPLETED",
      });
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setCompleting(null);
    }
  };

  const total = (order) =>
    (order.items || []).reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div className="board-page">
      <h1 className="seccion-titulo">Tablero de pedidos</h1>

      {loading && <p className="estado-msg">Cargando pedidos...</p>}
      {error && <p className="estado-msg error">{error}</p>}

      {!loading && (
        <div className="board-columns">
          {columns.map((col) => {
            const colOrders = orders.filter((o) => matchesStage(o, col.stage));
            return (
              <div key={col.stage} className="board-column">
                <div className="board-column-header">
                  <span>{col.label}</span>
                  <span className="board-column-count">{colOrders.length}</span>
                </div>

                {colOrders.length === 0 && (
                  <p className="board-empty">Sin pedidos en esta etapa.</p>
                )}

                {colOrders.map((order) => {
                  const firstItem = (order.items || [])[0];
                  const thumb = firstItem ? productImages[firstItem.product_id] : null;
                  return (
                    <div key={order.order_id} className="order-card">
                      <Link to={`/pedidos/${order.order_id}`} className="order-card-link">
                        <div className="order-card-thumb">
                          {thumb ? (
                            <img src={thumb} alt="" />
                          ) : (
                            <span>陈</span>
                          )}
                        </div>
                        <div className="order-card-body">
                          <span className="order-card-title">
                            {(order.items || [])
                              .map((it) => `${it.quantity}x ${it.name || it.product_id}`)
                              .join(", ")}
                          </span>
                          <span className="order-card-meta">
                            #{order.order_id.slice(0, 8)} · {formatPrice(total(order))}
                          </span>
                        </div>
                      </Link>
                      {canComplete && order.task_token && (
                        <button
                          className="order-card-complete"
                          disabled={completing === order.order_id}
                          onClick={() => handleComplete(order, col.stage)}
                        >
                          {completing === order.order_id ? "Completando..." : "Completar etapa"}
                        </button>
                      )}
                      {canComplete && !order.task_token && (
                        <p className="order-card-pending">Esperando asignación de tarea...</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
