import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "../api/orders";
import { listProducts } from "../api/products";
import { statusLabel } from "../utils/orderStatus";
import { formatPrice } from "../utils/format";
import "./Home.css";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [orderData, products] = await Promise.all([listOrders(), listProducts()]);
        setOrders(orderData);
        setProductImages(
          Object.fromEntries(products.map((p) => [p.product_id, p.image_url]))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusOptions = useMemo(() => {
    const present = new Set(orders.map((o) => o.status).filter(Boolean));
    return Array.from(present).sort();
  }, [orders]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")),
    [orders]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sortedOrders.filter((order) => {
      const matchesStatus = !statusFilter || order.status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      const haystack = [
        order.order_id,
        order.created_by,
        ...(order.items || []).map((it) => it.name || it.product_id),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [sortedOrders, search, statusFilter]);

  const total = (order) =>
    (order.items || []).reduce((sum, it) => sum + it.price * it.quantity, 0);

  const orderTitle = (order) =>
    (order.items || []).map((it) => `${it.quantity}x ${it.name || it.product_id}`).join(", ") ||
    "Pedido";

  const orderThumbnail = (order) => {
    const firstItem = (order.items || [])[0];
    return firstItem ? productImages[firstItem.product_id] : null;
  };

  return (
    <div className="home-page">
      <h1 className="seccion-titulo">Historial de pedidos</h1>

      <div className="home-toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar por pedido, cliente o producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="estado-msg">Cargando pedidos...</p>}
      {error && <p className="estado-msg error">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="estado-msg">No hay pedidos que coincidan con esos filtros.</p>
      )}

      <div className="orders-list">
        {filtered.map((order) => {
          const thumb = orderThumbnail(order);
          return (
            <Link key={order.order_id} to={`/pedidos/${order.order_id}`} className="order-row">
              <div className="order-thumb">
                {thumb ? <img src={thumb} alt="" /> : <span className="order-thumb-fallback">陈</span>}
              </div>

              <div className="order-row-main">
                <span className="order-name">{orderTitle(order)}</span>
                <span className="order-meta">
                  #{order.order_id.slice(0, 8)} · {order.created_by || "—"} ·{" "}
                  {order.created_at ? new Date(order.created_at).toLocaleString("es-PE") : "—"}
                </span>
              </div>

              <span className="order-status">{statusLabel(order.status)}</span>
              <span className="order-total">{formatPrice(total(order))}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
