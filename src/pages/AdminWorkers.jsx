import React, { useState } from "react";
import { createUser, deleteUser } from "../api/users";
import { ROLES } from "../config";
import "./AdminWorkers.css";

const initialCreateForm = { user_id: "", password: "", role: "cook" };

export default function AdminWorkers() {
  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createMessage, setCreateMessage] = useState("");

  const [deleteUserId, setDeleteUserId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleCreateChange = (e) =>
    setCreateForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setCreateMessage("");
    try {
      await createUser(createForm);
      setCreateMessage(`Trabajador "${createForm.user_id}" creado con rol ${createForm.role}.`);
      setCreateForm(initialCreateForm);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (!deleteUserId.trim()) return;
    setDeleting(true);
    setDeleteError("");
    setDeleteMessage("");
    try {
      await deleteUser(deleteUserId.trim());
      setDeleteMessage(`Usuario "${deleteUserId.trim()}" eliminado.`);
      setDeleteUserId("");
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="seccion-titulo">Administrar trabajadores</h1>

      <div className="admin-grid">
        <form className="admin-card" onSubmit={handleCreate}>
          <h3>Crear trabajador</h3>
          <label>
            Usuario
            <input
              name="user_id"
              value={createForm.user_id}
              onChange={handleCreateChange}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={createForm.password}
              onChange={handleCreateChange}
              required
            />
          </label>
          <label>
            Rol
            <select name="role" value={createForm.role} onChange={handleCreateChange}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          {createError && <p className="admin-error">{createError}</p>}
          {createMessage && <p className="admin-ok">{createMessage}</p>}
          <button type="submit" className="btn-primario" disabled={creating}>
            {creating ? "Creando..." : "Crear trabajador"}
          </button>
        </form>

        <form className="admin-card" onSubmit={handleDeleteSubmit}>
          <h3>Eliminar trabajador</h3>
          <label>
            Usuario a eliminar
            <input
              value={deleteUserId}
              onChange={(e) => setDeleteUserId(e.target.value)}
              placeholder="user_id"
            />
          </label>
          {deleteError && <p className="admin-error">{deleteError}</p>}
          {deleteMessage && <p className="admin-ok">{deleteMessage}</p>}
          <button type="submit" className="btn-peligro" disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </form>
      </div>
    </div>
  );
}
