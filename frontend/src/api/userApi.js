const API_URL = "http://127.0.0.1:8000/api";

// 🔐 fonction pour récupérer le token dynamiquement
const getToken = () => localStorage.getItem("token");

// 🔹 GET USERS
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
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

  return res.json();
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

  return res.json();
};

// 🔹 DELETE USER
export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

export const updateProfile = async (data) => {
    const res = await fetch("http://127.0.0.1:8000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    return res.json();
  };

  export const updatePassword = async (data) => {
    const res = await fetch("http://127.0.0.1:8000/api/profile/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    return res.json();
  };