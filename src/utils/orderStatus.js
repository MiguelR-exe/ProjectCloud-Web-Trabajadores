const STATUS_LABELS = {
  RECEIVED: "Pedido recibido",
  WAITING_COOK: "Por cocinar",
  COOK_COMPLETED: "Cocina terminada",
  COOK: "En preparación",
  WAITING_PACK: "Por empaquetar",
  PACK_COMPLETED: "Empaque terminado",
  PACK: "Empaquetando",
  WAITING_DELIVER: "Por repartir",
  DELIVER_COMPLETED: "Entrega en destino",
  DELIVER: "En camino",
  WAITING_RECEIVE: "Esperando confirmación del cliente",
  COMPLETED: "Entregado",
  FAILED: "Flujo fallido",
  EXPIRED: "Tiempo vencido",
};

export function statusLabel(status) {
  return STATUS_LABELS[status?.toUpperCase()] || status || "—";
}
