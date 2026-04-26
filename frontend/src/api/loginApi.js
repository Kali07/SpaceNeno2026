export const login = async (data) => {// fonction de connexion qui envoie une requête au backend pour authentifier l'utilisateur avec les informations d'identification fournies, stocke les données de l'utilisateur et le token dans le stockage local, et retourne la réponse JSON contenant les données de l'utilisateur connecté ou un message d'erreur en cas d'échec de la connexion
    const res = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    return res.json();// retourne la réponse JSON contenant les données de l'utilisateur connecté ou un message d'erreur en cas d'échec de la connexion
  };