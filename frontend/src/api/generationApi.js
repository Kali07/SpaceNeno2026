const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getGenerations() {
  const res = await fetch(`${API_URL}/generations`, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
}

export async function createGeneration(label) {
  const res = await fetch(`${API_URL}/generations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ label }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
}

export async function deleteGeneration(id) {
  const res = await fetch(`${API_URL}/generations/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
}

export async function updateGeneration(id, label) {
    const res = await fetch(`${API_URL}/generations/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ label}),
    });
  
    const data = await res.json();
  
    if (!res.ok) throw new Error(data.error);
  
    return data;
  }