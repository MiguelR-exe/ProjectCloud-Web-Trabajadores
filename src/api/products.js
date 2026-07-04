import { apiRequest } from "./client";

export async function listProducts() {
  const data = await apiRequest("/products");
  return data.products || [];
}
