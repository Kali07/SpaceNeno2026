import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Map } from 'lucide-react';

import { getStations, createStation, deleteStation, updateStation } from '../api/stationApi';
import { getVilles } from '../api/villeApi';

import { useEffect, useState } from 'react';

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [villes, setVilles] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [villeId, setVilleId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingVilleId, setEditingVilleId] = useState("");

  const fetchData = async () => {
    const s = await getStations();
    const v = await getVilles();

    setStations(s);
    setVilles(v);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 CREATE
  const handleCreate = async () => {
    await createStation({
      name,
      ville_id: villeId,
    });

    setName("");
    setVilleId("");
    setShowForm(false);
    fetchData();
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette station ?")) return;

    await deleteStation(id);
    fetchData();
  };

  // 🔹 EDIT
  const handleEdit = (station) => {
    setEditingId(station.id);
    setEditingName(station.name);
    setEditingVilleId(station.ville_id);
  };

  // 🔹 UPDATE
  const handleUpdate = async (id) => {
    await updateStation(id, {
      name: editingName,
      ville_id: editingVilleId,
    });

    setEditingId(null);
    setEditingName("");
    setEditingVilleId("");
    fetchData();
  };


  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#333]">Stations</h1>
          <p className="text-sm text-[#666]">{stations.length} stations</p>
        </div>

        <button
          className="bg-[#0066CC] text-white px-4 py-2 rounded-lg"
          onClick={() => setShowForm(!showForm)}
        >
          + Ajouter
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-4 rounded-xl shadow flex gap-3 flex-wrap">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la station"
            className="border px-3 py-2 rounded-lg"
          />

          <select
            value={villeId}
            onChange={(e) => setVilleId(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Choisir une ville</option>
            {villes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Valider
          </button>

          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500"
          >
            Annuler
          </button>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <Card key={station.id} className="shadow-sm hover:shadow-md">
            <CardContent className="p-5">

              {/* TOP */}
              <div className="flex justify-between mb-3">
                <div className="w-10 h-10 bg-[#0066CC]/10 flex items-center justify-center rounded-lg">
                  <MapPin className="text-[#0066CC]" />
                </div>

           {/*     <Badge className="text-xs background-color: transparent" data-testid="station-status">
                  {station.status || "active"}
                </Badge>*/}
              </div>

              {/* NAME */}
              {editingId === station.id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                <h3 className="font-semibold">{station.name}</h3>
              )}

              <p className="text-xs text-gray-500 mt-1">
                {station.address || "Aucune adresse"}
              </p>

              {/* INFO */}
              <div className="mt-3 space-y-2 text-sm">

                <div className="flex gap-2">
                  <Users className="h-4 w-4" />
                  {station.memberCount || 0} membres
                </div>

                <div className="flex gap-2">
                  <Map className="h-4 w-4" />

                  {editingId === station.id ? (
                    <select
                      value={editingVilleId}
                      onChange={(e) => setEditingVilleId(e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      {villes.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-blue-600">
                      {station.ville?.name || "N/A"}
                    </span>
                  )}

                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-3 text-sm">

                {editingId === station.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(station.id)}
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
                      onClick={() => handleEdit(station)}
                      className="text-blue-600"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(station.id)}
                      className="text-red-500"
                    >
                      Supprimer
                    </button>
                  </>
                )}

              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}