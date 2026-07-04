import { apiRequest } from "./client";
import { TENANT_ID } from "../config";

export function login({ user_id, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { tenant_id: TENANT_ID, user_id, password },
  });
}
