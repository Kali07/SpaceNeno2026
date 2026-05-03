const API_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// 🔹 récupérer les demandes
export const getApprovals = async () => {
  const res = await fetch(`${API_URL}/approvals`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};

// 🔹 approuver
export const approveRequest = async (id) => {
  const res = await fetch(`${API_URL}/approvals/${id}/approve`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};

export const rejectRequest = async (id) => {
  const res = await fetch(`${API_URL}/approvals/${id}/reject`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};



