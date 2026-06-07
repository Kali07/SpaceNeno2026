const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getPays(page = 1) {
  const res = await fetch(`${API_URL}/pays?page=${page}`, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Erreur lors du chargement des pays"
    );
  }

  return data;
}

export async function createPays(data) {
  const res = await fetch(`${API_URL}/pays`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error || result.message || "Erreur lors de la création"
    );
  }

  return result;
}

export async function deletePays(id) {
  const res = await fetch(`${API_URL}/pays/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error || result.message || "Erreur lors de la suppression"
    );
  }

  return result;
}

export async function updatePays(id, data) {
  const res = await fetch(`${API_URL}/pays/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error || result.message || "Erreur lors de la modification"
    );
  }

  return result;
}