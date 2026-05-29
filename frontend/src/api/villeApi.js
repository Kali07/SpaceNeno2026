const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getVilles() {
  const res = await fetch(`${API_URL}/villes`, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erreur lors du chargement des villes");
  }

  return data;
}

export async function createVille(data) {
  const res = await fetch(`${API_URL}/villes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Erreur lors de la création");
  }

  return result;
}

export async function deleteVille(id) {
  const res = await fetch(`${API_URL}/villes/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Erreur lors de la suppression");
  }

  return result;
}

export async function updateVille(id, data) {
  const res = await fetch(`${API_URL}/villes/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Erreur lors de la modification");
  }

  return result;
}