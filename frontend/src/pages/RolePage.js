import { useEffect, useState } from "react";
import {getRoles,createRole,deleteRole,updateRole} from "../api/roleApi";
import { useMessage } from "../context/MessageContext";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [label, setLabel] = useState("");
  const [level, setLevel] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingLevel, setEditingLevel] = useState("");

  const { showMessage } = useMessage();

  const fetchData = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      await createRole(label, level);

      setLabel("");
      setLevel("");

      showMessage("Création du rôle réussie !");
      fetchData();
    } catch (err) {
      showMessage(err.message || "Erreur lors de la création", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce rôle ?")) return;

    try {
      await deleteRole(id);

      showMessage("Suppression du rôle réussie !");
      fetchData();
    } catch (err) {
      showMessage(err.message || "Erreur lors de la suppression", "error");
    }
  };

  const handleEdit = (role) => {
    setEditingId(role.id);
    setEditingLabel(role.label);
    setEditingLevel(role.level);
  };

  const handleUpdate = async (id) => {
    try {
      await updateRole(id, editingLabel, editingLevel);

      setEditingId(null);
      setEditingLabel("");
      setEditingLevel("");

      showMessage("Modification du rôle réussie !");
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
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-5xl font-bold text-white">
                  Rôles
                </h1>

                <p className="text-white/80 text-lg mt-1">
                  Gestion des rôles de la plateforme
                </p>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center rounded-full bg-white/15 px-5 py-2 text-white backdrop-blur-sm">
              {roles.length} rôle{roles.length > 1 ? "s" : ""}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-white text-[#3E63D3] px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-200"
          >
            + Ajouter un rôle
          </button>
        </div>
      </div>

      {/* FORMULAIRE */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Titre du rôle..."
            className="w-full bg-[#F7F8FC] rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-[#4D7CFE]"
          />

          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Niveau de privilège..."
            className="w-full bg-[#F7F8FC] rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-[#4D7CFE]"
          />
        </div>
      </div>

      {/* LISTE DES ROLES */}
      {roles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* HEADER CARD */}
              <div className="flex justify-between items-start mb-8">
                <div className="w-20 h-20 rounded-[24px] bg-[#EEF3FF] flex items-center justify-center">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#3E63D3]"
                  >
                    <path
                      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <span className="px-4 py-2 rounded-xl bg-green-50 text-green-600 font-medium">
                  Actif
                </span>
              </div>

              {/* MODE EDITION */}
              {editingId === role.id ? (
                <>
                  <input
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    className="w-full bg-[#F7F8FC] rounded-xl px-4 py-3 mb-4 border"
                    placeholder="Titre"
                  />

                  <input
                    value={editingLevel}
                    onChange={(e) => setEditingLevel(e.target.value)}
                    className="w-full bg-[#F7F8FC] rounded-xl px-4 py-3 mb-6 border"
                    placeholder="Niveau"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(role.id)}
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
                  {/* INFOS ROLE */}
                  <h2 className="text-4xl font-bold text-slate-900 mb-2">
                    {role.label}
                  </h2>

                  <p className="text-slate-500 mb-6">
                    Rôle actif
                  </p>

                  <div className="bg-[#F8FAFD] rounded-[24px] p-6 mb-6">
                    <p className="text-[#4D7CFE] font-medium mb-3">
                      Niveau de privilège
                    </p>

                    <div className="text-5xl font-bold text-slate-900">
                      {role.level}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(role)}
                      className="flex-1 border border-slate-200 rounded-2xl py-4 font-semibold hover:bg-slate-50 transition"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(role.id)}
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
            Aucun rôle disponible
          </p>
        </div>
      )}
    </div>
  );
}