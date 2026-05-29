import { useEffect, useState } from "react";
import {
  getGenerations,
  createGeneration,
  deleteGeneration,
  updateGeneration,
} from "../api/generationApi";
import { useMessage } from "../context/MessageContext";

export default function GenerationsPage() {
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
    if (e) e.preventDefault();

    try {
      await createGeneration(label);

      setLabel("");

      showMessage("Création de la génération réussie !");
      fetchData();
    } catch (err) {
      showMessage(err.message || "Erreur lors de la création", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette génération ?")) return;

    try {
      await deleteGeneration(id);

      showMessage("Suppression de la génération réussie !");
      fetchData();
    } catch (err) {
      showMessage(err.message || "Erreur lors de la suppression", "error");
    }
  };

  const handleEdit = (generation) => {
    setEditingId(generation.id);
    setEditingLabel(generation.label);
  };

  const handleUpdate = async (id) => {
    try {
      await updateGeneration(id, editingLabel);

      setEditingId(null);
      setEditingLabel("");

      showMessage("Modification de la génération réussie !");
      fetchData();
    } catch (err) {
      showMessage(err.message || "Erreur lors de la modification", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#3E63D3] to-[#66A3FF] p-8 shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-[24px] bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-white"
                >
                  <path
                    d="M12 2L20 6V12C20 17.523 16.418 21.742 12 23C7.582 21.742 4 17.523 4 12V6L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-5xl font-bold text-white">
                  Générations
                </h1>

                <p className="text-white/80 text-lg mt-1">
                  Gestion des générations de la plateforme
                </p>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center rounded-full bg-white/15 px-5 py-2 text-white backdrop-blur-sm">
              {generations.length} génération
              {generations.length > 1 ? "s" : ""}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-white text-[#3E63D3] px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-200"
          >
            + Ajouter une génération
          </button>
        </div>
      </div>

      {/* FORMULAIRE */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 mb-8">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nom de la génération..."
          className="w-full bg-[#F7F8FC] rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-[#4D7CFE]"
        />
      </div>

      {/* CARDS */}
      {generations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {generations.map((generation) => (
            <div
              key={generation.id}
              className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-20 h-20 rounded-[24px] bg-[#EEF3FF] flex items-center justify-center">
                  <svg
                    width="36"
                    height="36"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[#3E63D3]"
                  >
                    <path
                      d="M12 2L20 6V12C20 17.523 16.418 21.742 12 23C7.582 21.742 4 17.523 4 12V6L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <span className="px-4 py-2 rounded-xl bg-green-50 text-green-600 font-medium">
                  Actif
                </span>
              </div>

              {editingId === generation.id ? (
                <>
                  <input
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    className="w-full bg-[#F7F8FC] rounded-xl px-4 py-3 mb-6 border"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(generation.id)}
                      className="flex-1 bg-green-500 text-white rounded-2xl py-4 font-semibold hover:bg-green-600 transition"
                    >
                      Enregistrer
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 border border-slate-200 rounded-2xl py-4 font-semibold hover:bg-slate-50 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-slate-900 mb-2">
                    {generation.label}
                  </h2>

                  <p className="text-slate-500 mb-6">
                    Génération active
                  </p>

              
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(generation)}
                      className="flex-1 border border-slate-200 rounded-2xl py-4 font-semibold hover:bg-slate-50 transition"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(generation.id)}
                      className="w-16 rounded-2xl bg-[#E2574C] text-white text-xl hover:bg-red-600 transition"
                    >
                      🗑
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-16 text-center shadow-sm">
          <p className="text-slate-500 text-lg">
            Aucune génération disponible
          </p>
        </div>
      )}
    </div>
  );
}