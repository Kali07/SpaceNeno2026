import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const MOCK_USER = {
  id: 'a1',
  name: 'Admin Principal',
  email: 'admin@nenospace.com',
  role: 'Super Admin',
  avatar: null,
};

export function AuthProvider({ children }) {// composant de contexte d'authentification qui gère l'état de l'utilisateur connecté, les fonctions de connexion et de déconnexion, et fournit ces informations à tous les composants enfants via le contexte
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {// effet de bord pour charger les informations de l'utilisateur à partir du stockage local lors du montage du composant, et simuler une authentification persistante
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);// simule un délai de chargement pour l'authentification persistante
  }, []);

  const login = useCallback(async (email, password) => {// fonction de connexion qui envoie une requête au backend pour authentifier l'utilisateur avec les informations d'identification fournies, stocke les données de l'utilisateur et le token dans le stockage local, et met à jour l'état de l'utilisateur connecté
    try {// simulation d'une requête de connexion au backend, remplacez cette partie par une requête réelle à votre API
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {// si la réponse du backend n'est pas OK, retourne une erreur avec le message d'erreur fourni par le backend ou un message générique
        return { success: false, error: data.error };
      }
  
      localStorage.setItem("token", data.token);// stocke le token d'authentification dans le stockage local pour une utilisation ultérieure dans les requêtes authentifiées
      localStorage.setItem("user", JSON.stringify(data.user));// stocke les données de l'utilisateur connecté dans le stockage local pour une utilisation ultérieure et pour maintenir l'état de connexion même après un rafraîchissement de la page
  
      setUser(data.user); // met à jour l'état de l'utilisateur connecté avec les données reçues du backend après une connexion réussie
  
      return { 
        success: true,
        user: data.user,
        token: data.token,
        change_password: data.change_password,
     };
  
    } catch (err) {// en cas d'erreur lors de la requête de connexion, retourne une erreur avec un message générique indiquant une erreur serveur
      return { success: false, error: "Erreur serveur" };
    }
  }, []);

  const logout = useCallback(() => {// fonction de déconnexion qui supprime les données de l'utilisateur et le token du stockage local, et met à jour l'état de l'utilisateur connecté à null
    localStorage.removeItem("token");// supprime le token d'authentification du stockage local pour empêcher les requêtes authentifiées après la déconnexion
    localStorage.removeItem("user");// supprime les données de l'utilisateur connecté du stockage local pour réinitialiser l'état de connexion
    setUser(null);// met à jour l'état de l'utilisateur connecté à null pour refléter la déconnexion
  }, []);

  return (// rendu du fournisseur de contexte d'authentification qui enveloppe les composants enfants et fournit les informations de l'utilisateur connecté, les fonctions de connexion et de déconnexion, et l'état de chargement via le contexte
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {// hook personnalisé pour accéder au contexte d'authentification, qui vérifie que le contexte est utilisé dans un composant enfant du fournisseur de contexte et retourne les informations de l'utilisateur connecté, les fonctions de connexion et de déconnexion, et l'état de chargement
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
