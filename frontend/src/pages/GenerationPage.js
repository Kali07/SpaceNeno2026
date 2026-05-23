import { useEffect, useState } from "react";
import { getGenerations, createGeneration, deleteGeneration,updateGeneration} from "../api/generationApi";
import { useMessage } from "../context/MessageContext";



export default function GneerationsPage() {
  const [generations, setGenerations] = useState([]);
  const [label, setLabel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const { showMessage } = useMessage();

  const fetchData = async () => {
    const data = await getGenerations();
    setGenerations(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    await createGeneration(label);
    setLabel("");

    showMessage("Création de la génération reussi !")

    fetchData();
} catch (err) {
    showMessage(err.message || "Erreur lors de la création", "error");
  }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette Génération ?")) return;
    try{
    await deleteGeneration(id);
    showMessage("suppression de la génération reussi !")
    fetchData();
} catch (err) {
    showMessage(err.message || "Erreur lors de la suppression ! ", "error");
  }
  };

  const handleEdit = (g) => {
    setEditingId(g.id);
    setEditingLabel(g.label);
  };

  const handleUpdate = async (id) => {
    try{
    await updateGeneration(id, editingLabel);
    setEditingId(null);
    setEditingLabel("");

    showMessage("Modification de la génération reussi !")
    fetchData();
} catch (err) {
    showMessage(err.message || "Erreur lors de la modification", "error");
  }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Générations</h1>

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
            placeholder="Nom de la génération"
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
            {generations.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="py-2">
                  {editingId === g.id ? (
                    <input
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    g.label
                  )}
                </td>

                <td className="flex gap-2 py-2">
                  {editingId === g.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(g.id)}
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
                        onClick={() => handleEdit(g)}
                        className="text-yellow-500"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(g.id)}
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

        {generations.length === 0 && (
          <p className="text-gray-500 mt-4">Aucune génération</p>
        )}
      </div>
    </div>
  );
}