import { apiRequest } from "./client";

export function createUser({ user_id, password, role }) {
  return apiRequest("/users", {
    method: "POST",
    auth: true,
    body: { user_id, password, role },
  });
}

export async function listUsers() {
  const data = await apiRequest("/users", { auth: true });
  return data.users || [];
}

export function deleteUser(userId) {
  return apiRequest(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    auth: true,
  });
}
