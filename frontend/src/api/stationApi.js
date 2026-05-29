const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getStations() {
  const res = await fetch(`${API_URL}/stations`, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erreur lors du chargement des stations");
  }

  return data;
}

export async function createStation(data) {
  const res = await fetch(`${API_URL}/stations`, {
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

export async function deleteStation(id) {
  const res = await fetch(`${API_URL}/stations/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Erreur lors de la suppression");
  }

  return result;
}

export async function updateStation(id, data) {
  const res = await fetch(`${API_URL}/stations/${id}`, {
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

export async function getGestionnaires() {
  const res = await fetch(`${API_URL}/gestionnaires`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erreur lors du chargement des gestionnaires");
  }

  return data;
}