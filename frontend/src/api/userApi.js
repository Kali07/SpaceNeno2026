const API_URL = "http://127.0.0.1:8000/api";

// 🔐 fonction pour récupérer le token dynamiquement
const getToken = () => localStorage.getItem("token");

// 🔹 GET USERS
export const getUsers = async (page = 1) => {
  const res = await fetch(`${API_URL}/users?page=${page}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Erreur lors du chargement des utilisateurs"
    );
  }

  return data;
};

// 🔹 GET USER BY ID
export const getUserById = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Utilisateur introuvable"
    );
  }

  return data;
};

// 🔹 CREATE USER
export const createUser = async (data) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error ||
      result.message ||
      "Erreur lors de la création"
    );
  }

  return result;
};

// 🔹 UPDATE USER
export const updateUser = async (id, data) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error ||
      result.message ||
      "Erreur lors de la modification"
    );
  }

  return result;
};

// 🔹 DELETE USER
export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error ||
      result.message ||
      "Erreur lors de la suppression"
    );
  }

  return result;
};

// 🔹 UPDATE PROFILE
export const updateProfile = async (data) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error ||
      result.message ||
      "Erreur lors de la mise à jour du profil"
    );
  }

  return result;
};

// 🔹 UPDATE PASSWORD
export const updatePassword = async (data) => {
  const res = await fetch(`${API_URL}/profile/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error ||
      result.message ||
      "Erreur lors de la modification du mot de passe"
    );
  }

  return result;
};