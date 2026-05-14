import { useEffect, useState } from "react";
import {
  getContinents,
  createContinent,
  deleteContinent,
  updateContinent,
} from "../api/continentApi";

export default function ContinentsPage() {
  const [continents, setContinents] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const fetchData = async () => {
    const data = await getContinents();
    setContinents(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createContinent(name);
    setName("");
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce continent ?")) return;
    await deleteContinent(id);
    fetchData();
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setEditingName(c.name);
  };

  const handleUpdate = async (id) => {
    await updateContinent(id, editingName);
    setEditingId(null);
    setEditingName("");
    fetchData();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Continents</h1>

        <button
          onClick={handleSubmit}
          className="bg-[#0066CC] text-white px-4 py-2 rounded-lg"
        >
          + Ajouter
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du continent"
            className="border rounded-lg px-3 py-2 w-1/3"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Nom</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {continents.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2">
                  {editingId === c.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    c.name
                  )}
                </td>

                <td className="flex gap-2 py-2">
                  {editingId === c.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(c.id)}
                        className="text-green-600"
                      >
                        OK
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-yellow-500"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {continents.length === 0 && (
          <p className="text-gray-500 mt-4">Aucun continent</p>
        )}
      </div>
    </div>
  );
}