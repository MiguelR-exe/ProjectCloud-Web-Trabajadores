import { API_URL } from "../config";

const TOKEN_KEY = "auth_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent("auth:expired"));
    throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    throw new Error((data && (data.message || data.error)) || "Ocurrió un error inesperado.");
  }

  return data;
}
