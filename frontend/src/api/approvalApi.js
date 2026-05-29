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

  if (!res.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Erreur lors du chargement des demandes"
    );
  }

  return data;
};

// 🔹 approuver
export const approveRequest = async (id) => {
  const res = await fetch(`${API_URL}/approvals/${id}/approve`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Erreur lors de l'approbation"
    );
  }

  return data;
};

// 🔹 refuser
export const rejectRequest = async (id) => {
  const res = await fetch(`${API_URL}/approvals/${id}/reject`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Erreur lors du refus"
    );
  }

  return data;
};