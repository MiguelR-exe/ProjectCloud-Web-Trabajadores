const STATUS_LABELS = {
  RECEIVED: "Pedido recibido",
  WAITING_COOK: "Por cocinar",
  COOK: "En preparación",
  WAITING_PACK: "Por empaquetar",
  PACK: "Empaquetando",
  WAITING_DELIVER: "Por repartir",
  DELIVER: "En camino",
  COMPLETED: "Entregado",
};

export function statusLabel(status) {
  return STATUS_LABELS[status?.toUpperCase()] || status || "—";
}
