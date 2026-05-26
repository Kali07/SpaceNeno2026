const API_URL = "http://127.0.0.1:8000/api";

// 🔐 fonction pour récupérer le token dynamiquement
const getToken = () => localStorage.getItem("token");

// 🔹 GET USERS
export const getUsers = async (page = 1) => {// fonction pour récupérer la liste paginée des utilisateurs en envoyant une requête GET au backend avec le token d'authentification dans les en-têtes, et retourner la réponse JSON contenant les données paginées des utilisateurs
  
  const res = await fetch(`${API_URL}/users?page=${page}`, {// envoie une requête GET à l'endpoint /users du backend avec le numéro de page pour récupérer la liste paginée des utilisateurs
    
    headers: {
      Authorization: `Bearer ${getToken()}`,// inclut le token d'authentification dans les en-têtes de la requête pour permettre au backend de vérifier l'identité de l'utilisateur et d'autoriser l'accès aux données des utilisateurs
    },

  });

  // vérifie si la requête a échoué et lance une erreur si nécessaire
  if (!res.ok) {
    throw new Error("Erreur lors du chargement des utilisateurs");
  }

  return res.json();// retourne la réponse JSON contenant les données paginées des utilisateurs récupérées du backend :
                    // data = liste des utilisateurs
                    // current_page = page actuelle
                    // last_page = nombre total de pages
                    // total = nombre total d'utilisateurs
};


export const getUserById = async (id) => {

  const res = await fetch(`${API_URL}/users/${id}`, {

    headers: {
      Authorization: `Bearer ${getToken()}`,
    },

  });

  if (!res.ok) {

    throw new Error("Utilisateur introuvable");

  }

  return res.json();
};


// 🔹 CREATE USER
export const createUser = async (data) => {// fonction pour créer un nouvel utilisateur en envoyant une requête POST au backend avec les données de l'utilisateur dans le corps de la requête, et retourner la réponse JSON contenant les données du nouvel utilisateur créé
  const res = await fetch(`${API_URL}/users`, {// envoie une requête POST à l'endpoint /users du backend pour créer un nouvel utilisateur avec les données fournies dans le corps de la requête
    method: "POST",
    headers: {// inclut les en-têtes nécessaires pour indiquer que le corps de la requête est au format JSON et pour inclure le token d'authentification pour autoriser la création d'un nouvel utilisateur
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 🔹 UPDATE USER
export const updateUser = async (id, data) => {// fonction pour mettre à jour les informations d'un utilisateur existant en envoyant une requête PUT au backend avec l'ID de l'utilisateur dans l'URL et les données mises à jour dans le corps de la requête, et retourner la réponse JSON contenant les données de l'utilisateur mis à jour
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {// inclut les en-têtes nécessaires pour indiquer que le corps de la requête est au format JSON et pour inclure le token d'authentification pour autoriser la mise à jour des informations de l'utilisateur
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 🔹 DELETE USER
export const deleteUser = async (id) => {// fonction pour supprimer un utilisateur existant en envoyant une requête DELETE au backend avec l'ID de l'utilisateur dans l'URL, et retourner la réponse JSON contenant les données de l'utilisateur supprimé
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {// inclut le token d'authentification dans les en-têtes de la requête pour autoriser la suppression de l'utilisateur
      Authorization: `Bearer ${getToken()}`,// inclut le token d'authentification dans les en-têtes de la requête pour autoriser la suppression de l'utilisateur
    },
  });

  return res.json();
};

export const updateProfile = async (data) => {// fonction pour mettre à jour les informations du profil de l'utilisateur connecté en envoyant une requête PUT au backend avec les données mises à jour dans le corps de la requête, et retourner la réponse JSON contenant les données du profil mis à jour
    const res = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {// inclut les en-têtes nécessaires pour indiquer que le corps de la requête est au format JSON et pour inclure le token d'authentification pour autoriser la mise à jour des informations du profil de l'utilisateur connecté
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),// inclut les données mises à jour du profil de l'utilisateur connecté dans le corps de la requête au format JSON pour que le backend puisse les traiter et mettre à jour les informations du profil de l'utilisateur connecté en conséquence
    });
  
    return res.json();
  };

  export const updatePassword = async (data) => {// fonction pour mettre à jour le mot de passe de l'utilisateur connecté en envoyant une requête PUT au backend avec les données mises à jour dans le corps de la requête, et retourner la réponse JSON contenant les données du mot de passe mis à jour
    const res = await fetch(`${API_URL}/profile/password`, {
      method: "PUT",
      headers: {// inclut les en-têtes nécessaires pour indiquer que le corps de la requête est au format JSON et pour inclure le token d'authentification pour autoriser la mise à jour du mot de passe de l'utilisateur connecté
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    return res.json();
  };
