const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getVilles() {
  const res = await fetch(`${API_URL}/villes`, { headers: getHeaders() });
  return res.json();
}

export async function createVille(data) {
  const res = await fetch(`${API_URL}/villes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteVille(id) {
  const res = await fetch(`${API_URL}/villes/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return res.json();
}

export async function updateVille(id, data) {
    const res = await fetch(`http://127.0.0.1:8000/api/villes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    return res.json();
  }