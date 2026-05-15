import { useEffect, useState } from "react";
import { getRoles,createRole,deleteRole,updateRole}from "../api/roleApi";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [label, setLabel] = useState("");
  const [level, setLevel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingLevel, setEditingLevel] = useState("");

  const fetchData = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRole(label, level);
    setLabel("");
    setLevel("");

    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce role ?")) return;
    await deleteRole(id);
    fetchData();
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setEditingLabel(r.label);
    setEditingLevel(r.level);
  };

  const handleUpdate = async (id) => {
    await updateRole(id, editingLabel, editingLevel);
    setEditingId(null);
    setEditingLabel("");
    setEditingLevel("");

    fetchData();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Roles</h1>

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
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Titre du Role"
            className="border rounded-lg px-3 py-2 w-1/3"
          />
        </div>
        <div className="flex gap-3">
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Niveau de privilège"
            className="border rounded-lg px-3 py-2 w-1/3"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Titre</th>
              <th className="py-2">Niveau</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="py-2">
                  {editingId === r.id ? (
                    <input
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    r.label
                  )}
                </td>

                <td className="py-2">
                  {editingId === r.id ? (
                    <input
                      value={editingLevel}
                      onChange={(e) => setEditingLevel(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    r.level
                  )}
                </td>

                <td className="flex gap-2 py-2">
                  {editingId === r.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(r.id)}
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
                        onClick={() => handleEdit(r)}
                        className="text-yellow-500"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(r.id)}
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

        {roles.length === 0 && (
          <p className="text-gray-500 mt-4">Aucun role</p>
        )}
      </div>
    </div>
  );
}