import { useEffect, useState } from "react";
import {
  getPays,
  createPays,
  deletePays,
  updatePays,
} from "../api/paysApi";
import { getContinents } from "../api/continentApi";

export default function PaysPage() {
  const [pays, setPays] = useState([]);
  const [continents, setContinents] = useState([]);

  const [name, setName] = useState("");
  const [continentId, setContinentId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingContinentId, setEditingContinentId] = useState("");

  const fetchData = async () => {
    const p = await getPays();
    const c = await getContinents();

    setPays(p);
    setContinents(c);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    await createPays({
      name,
      continent_id: continentId,
    });

    setName("");
    setContinentId("");
    fetchData();
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce pays ?")) return;

    await deletePays(id);
    fetchData();
  };

  // 🔹 START EDIT
  const handleEdit = (p) => {
    setEditingId(p.id);
    setEditingName(p.name);
    setEditingContinentId(p.continent_id);
  };

  // 🔹 UPDATE
  const handleUpdate = async (id) => {
    await updatePays(id, {
      name: editingName,
      continent_id: editingContinentId,
    });

    setEditingId(null);
    setEditingName("");
    setEditingContinentId("");
    fetchData();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Pays</h1>

        <button
          onClick={handleSubmit}
          className="bg-[#0066CC] text-white px-4 py-2 rounded-lg"
        >
          + Ajouter un pays
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex gap-3 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du pays"
            className="border rounded-lg px-3 py-2 w-1/3"
          />

          <select
            value={continentId}
            onChange={(e) => setContinentId(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Choisir un continent</option>
            {continents.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Nom</th>
              <th>Continent</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {pays.map((p) => (
              <tr key={p.id} className="border-b">
                {/* NOM */}
                <td className="py-2">
                  {editingId === p.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    p.name
                  )}
                </td>

                {/* CONTINENT */}
                <td>
                  {editingId === p.id ? (
                    <select
                      value={editingContinentId}
                      onChange={(e) =>
                        setEditingContinentId(e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      {continents.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    p.continent?.name
                  )}
                </td>

                {/* ACTIONS */}
                <td className="flex gap-2 py-2">
                  {editingId === p.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(p.id)}
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
                        onClick={() => handleEdit(p)}
                        className="text-yellow-500"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
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

        {pays.length === 0 && (
          <p className="text-gray-500 mt-4">Aucun pays</p>
        )}
      </div>
    </div>
  );
}