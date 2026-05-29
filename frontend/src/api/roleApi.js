const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getRoles() {
  const res = await fetch(`${API_URL}/roles`, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Erreur lors du chargement des rôles"
    );
  }

  return data;
}

export async function createRole(label, level) {
  const res = await fetch(`${API_URL}/roles`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ label, level }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Erreur lors de la création"
    );
  }

  return data;
}

export async function deleteRole(id) {
  const res = await fetch(`${API_URL}/roles/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Erreur lors de la suppression"
    );
  }

  return data;
}

export async function updateRole(id, label, level) {
  const res = await fetch(`${API_URL}/roles/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ label, level }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Erreur lors de la modification"
    );
  }

  return data;
}