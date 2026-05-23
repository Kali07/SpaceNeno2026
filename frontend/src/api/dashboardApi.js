const API_URL = "http://127.0.0.1:8000/api";



export async function getDashboard() {
    const res = await fetch(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    return res.json();
  }