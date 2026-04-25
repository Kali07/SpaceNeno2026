const API_URL = "http://127.0.0.1:8000/api";

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};

export const createUser = async (data) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateUser = async (id, data) => {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    return res.json();
  };

  export const deleteUser = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
      method: "DELETE",
    });
  
    return res.json();
  };

function Dashboard() {
    const [users, setUsers] = useState([]);
  
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
    });
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      await createUser({
        ...form,
        role_id: 1,
      });
  
      fetchUsers();
    };
  
    return (
      <div>
        <h1>Users</h1>
  
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
  
          <button>Create</button>
        </form>
  
        {users.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
  
  export default Dashboard;