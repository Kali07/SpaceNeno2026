const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getContinents() {
  const res = await fetch(`${API_URL}/continents`, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Erreur lors du chargement des continents"
    );
  }

  return data;
}

export async function createContinent(name) {
  const res = await fetch(`${API_URL}/continents`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Erreur lors de la création"
    );
  }

  return data;
}

export async function deleteContinent(id) {
  const res = await fetch(`${API_URL}/continents/${id}`, {
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

export async function updateContinent(id, name) {
  const res = await fetch(`${API_URL}/continents/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ name }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Erreur lors de la modification"
    );
  }

  return data;
}