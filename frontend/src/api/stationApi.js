const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getStations() {
  const res = await fetch(`${API_URL}/stations`, { headers: getHeaders() });
  return res.json();
}

export async function createStation(data) {
  const res = await fetch(`${API_URL}/stations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteStation(id) {
  const res = await fetch(`${API_URL}/stations/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return res.json();
}

export async function updateStation(id, data) {
    const res = await fetch(`${API_URL}/stations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    return res.json();
  }

  export async function getGestionnaires() {
    const res = await fetch(`${API_URL}/gestionnaires`, {
      
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    return res.json();
  }