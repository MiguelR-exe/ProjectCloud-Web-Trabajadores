import { apiRequest } from "./client";

export async function listOrders() {
  const data = await apiRequest("/orders", { auth: true });
  return data.orders || data.items || [];
}

export function getOrder(orderId) {
  return apiRequest(`/orders/${encodeURIComponent(orderId)}`, { auth: true });
}

export function deleteOrder(orderId) {
  return apiRequest(`/orders/${encodeURIComponent(orderId)}`, {
    method: "DELETE",
    auth: true,
  });
}

export function taskCallback({ order_id, taskToken, workflow_step, status }) {
  return apiRequest("/tasks/callback", {
    method: "POST",
    auth: true,
    body: { order_id, taskToken, workflow_step, status },
  });
}
