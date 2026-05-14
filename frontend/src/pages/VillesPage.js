import { Card, CardContent } from '@/components/ui/card';
import { Map, MapPin, Users } from 'lucide-react';
import { getVilles, createVille, deleteVille, updateVille } from '../api/villeApi';
import { useEffect, useState } from 'react';
import { getPays } from "../api/paysApi";

export default function VillesPage() {
  const [paysList, setPaysList] = useState([]);
  const [paysId, setPaysId] = useState("");

  const [editingPaysId, setEditingPaysId] = useState("");

  const [villes, setVilles] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const fetchData = async () => {
    const v = await getVilles();
    const p = await getPays();

    setVilles(v);
    setPaysList(p);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE
  const handleCreate = async () => {
    await createVille({
      name,
      pays_id: paysId,
    });

    setName("");
    setPaysId("");
    setShowForm(false);

    fetchData();
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette ville ?")) return;

    await deleteVille(id);
    fetchData();
  };

  // START EDIT
  const handleEdit = (ville) => {
    setEditingId(ville.id);
    setEditingName(ville.name);
    setEditingPaysId(ville.pays_id);
  };

  // UPDATE
  const handleUpdate = async (id) => {
    await updateVille(id, {
      name: editingName,
      pays_id: editingPaysId,
    });

    setEditingId(null);
    setEditingName("");
    setEditingPaysId("");

    fetchData();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#333]">
            Villes
          </h1>

          <p className="text-sm text-[#666]">
            {villes.length} villes
          </p>
        </div>

        <button
          className="bg-[#0066CC] text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          onClick={() => setShowForm(!showForm)}
        >
          + Ajouter
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row gap-3">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la ville"
            className="border px-3 py-2 rounded-lg w-full sm:w-1/3"
          />

          <select
            value={paysId}
            onChange={(e) => setPaysId(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full sm:w-auto"
          >
            <option value="">
              Choisir un pays
            </option>

            {paysList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-3 py-2 rounded w-full sm:w-auto"
          >
            Valider
          </button>

          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500 w-full sm:w-auto"
          >
            Annuler
          </button>

        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {villes.map((ville) => (
          <Card
            key={ville.id}
            className="shadow-sm hover:shadow-md overflow-hidden"
          >
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">

              {/* ICON */}
              <div className="w-12 h-12 min-w-[48px] bg-[#00AA55]/10 flex items-center justify-center rounded-xl">
                <Map className="text-[#00AA55]" />
              </div>

              {/* CONTENT */}
              <div className="flex-1 mt-2 overflow-hidden">

                {/* EDIT MODE */}
                {editingId === ville.id ? (

                  <div className="flex flex-col sm:flex-row gap-2 mt-2">

                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />

                    <select
                      value={editingPaysId}
                      onChange={(e) => setEditingPaysId(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    >
                      {paysList.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                  </div>

                ) : (

                  <div>

                    <h3 className="font-semibold text-lg break-words">
                      {ville.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 break-words">
                      {ville.pays?.name || "Aucun pays"}
                    </p>

                  </div>

                )}

                {/* STATS */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 text-sm">

                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-blue-500" />

                    {ville.stationCount || 0} Stations
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />

                    {ville.memberCount || 0} Membres
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex flex-wrap gap-3 text-sm">

                  {editingId === ville.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(ville.id)}
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
                        onClick={() => handleEdit(ville)}
                        className="text-blue-600"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(ville.id)}
                        className="text-red-500"
                      >
                        Supprimer
                      </button>
                    </>
                  )}

                </div>

              </div>
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
}