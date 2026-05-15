const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getPays() {
  const res = await fetch(`${API_URL}/pays`, { headers: getHeaders() });
  return res.json();
}

export async function createPays(data) {
  const res = await fetch(`${API_URL}/pays`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deletePays(id) {
  const res = await fetch(`${API_URL}/pays/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return res.json();
}

export async function updatePays(id, data) {
    const res = await fetch(`${API_URL}/pays/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    return res.json();
  }