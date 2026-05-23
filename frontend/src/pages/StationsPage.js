import { Card, CardContent } from '@/components/ui/card';

import {
  MapPin,
  Users,
  Map,
  Eye,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Search,
  X,
  Check,
  UserCog
} from 'lucide-react';

import {
  getStations,
  createStation,
  deleteStation,
  updateStation,
  getGestionnaires
} from '../api/stationApi';

import { getVilles } from '../api/villeApi';

import { useNavigate } from "react-router-dom";

import { Button } from '@/components/ui/button';

import { useEffect, useMemo, useState } from 'react';

import { useMessage } from "../context/MessageContext";

export default function StationsPage() {

  // 🔹 STATES
  const [stations, setStations] = useState([]);

  const [villes, setVilles] = useState([]);

  const [gestionnaires, setGestionnaires] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  // 🔹 CREATE STATES
  const [name, setName] = useState("");

  const [villeId, setVilleId] = useState("");

  const [address, setAddress] = useState("");

  const [responsableId, setResponsableId] = useState(null);

  // 🔹 EDIT STATES
  const [editingId, setEditingId] = useState(null);

  const [editingName, setEditingName] = useState("");

  const [editingVilleId, setEditingVilleId] = useState("");

  const [editingAddress, setEditingAddress] = useState("");

  const [editingResponsableId, setEditingResponsableId] = useState(null);

  const { showMessage } = useMessage();

  const navigate = useNavigate();

  // 🔹 FETCH DATA
  const fetchData = async () => {

    try {

      const s = await getStations();

      const v = await getVilles();

      const g = await getGestionnaires();

      setStations(s);

      setVilles(v);

      setGestionnaires(g);

    } catch (err) {

      showMessage(
        "Erreur lors du chargement des données",
        "error"
      );
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // 🔹 FILTER
  const filteredStations = useMemo(() => {

    return stations.filter((station) => {

      const value = search.toLowerCase();

      return (
        station.name?.toLowerCase().includes(value) ||
        station.address?.toLowerCase().includes(value) ||
        station.ville?.name?.toLowerCase().includes(value)
      );
    });

  }, [stations, search]);

  // 🔹 CREATE
  const handleCreate = async () => {

    try {

      await createStation({

        name,

        ville_id: Number(villeId),

        address,

        responsable_id: responsableId
      });

      // RESET
      setName("");

      setVilleId("");

      setAddress("");

      setResponsableId(null);

      setShowForm(false);

      showMessage(
        "Création de la station réussie !"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la création",
        "error"
      );
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {

    if (!window.confirm(
      "Supprimer cette station ?"
    )) return;

    try {

      await deleteStation(id);

      showMessage(
        "Suppression de la station réussie !"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la suppression",
        "error"
      );
    }
  };

  // 🔹 EDIT
  const handleEdit = (station) => {

    setEditingId(station.id);

    setEditingName(station.name);

    setEditingVilleId(station.ville_id);

    setEditingAddress(
      station.address || ""
    );

    setEditingResponsableId(
      station.responsable_id || null
    );
  };

  // 🔹 UPDATE
  const handleUpdate = async (id) => {

    try {

      await updateStation(id, {

        name: editingName,

        ville_id: Number(editingVilleId),

        address: editingAddress,

        responsable_id: editingResponsableId
      });

      // RESET
      setEditingId(null);

      setEditingName("");

      setEditingVilleId("");

      setEditingAddress("");

      setEditingResponsableId(null);

      showMessage(
        "Modification de la station réussie !"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la modification",
        "error"
      );
    }
  };

  return (

    <div className="space-y-8">

      {/* 🔹 HERO */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#0055AA] via-[#0066CC] to-[#1E88E5] text-white shadow-lg">

        <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* LEFT */}
          <div>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">

                <Building2 className="h-8 w-8 text-white" />

              </div>

              <div>

                <h1 className="text-3xl md:text-4xl font-bold">
                  Stations
                </h1>

                <p className="text-white/80 mt-1">
                  Gestion centralisée des stations
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex gap-4 flex-wrap">

            <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 min-w-[140px]">

              <p className="text-sm text-white/70">
                Total stations
              </p>

              <h2 className="text-3xl font-bold mt-1">
                {stations.length}
              </h2>

            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 min-w-[140px]">

              <p className="text-sm text-white/70">
                Membres
              </p>

              <h2 className="text-3xl font-bold mt-1">

                {stations.reduce(
                  (acc, s) => acc + (s.users_count || 0),
                  0
                )}

              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* 🔹 ACTION BAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">

        {/* SEARCH */}
        <div className="relative w-full lg:max-w-md">

          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Rechercher une station..."
            className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />

        </div>

        {/* BUTTON */}
        <Button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="rounded-2xl bg-[#0066CC] hover:bg-[#0055AA] h-12 px-6"
        >

          {showForm ? (
            <X className="h-4 w-4 mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}

          {showForm ? "Fermer" : "Ajouter une station"}

        </Button>

      </div>

      {/* 🔹 FORM */}
      {showForm && (

        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">

          <h2 className="text-xl font-semibold text-[#222] mb-6">
            Nouvelle station
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* NOM */}
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Nom de la station"
              className="border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />

            {/* VILLE */}
            <select
              value={villeId}
              onChange={(e) =>
                setVilleId(e.target.value)
              }
              className="border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            >

              <option value="">
                Choisir une ville
              </option>

              {villes.map((v) => (

                <option
                  key={v.id}
                  value={v.id}
                >
                  {v.name}
                </option>

              ))}

            </select>

            {/* ADDRESS */}
            <input
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Adresse"
              className="border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />

            {/* RESPONSABLE */}
            <select
              value={responsableId ?? ""}
              onChange={(e) =>
                setResponsableId(
                  e.target.value
                    ? parseInt(e.target.value)
                    : null
                )
              }
              className="border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            >

              <option value="">
                Choisir un gestionnaire
              </option>

              {gestionnaires.map((g) => (

                <option
                  key={g.id}
                  value={g.id}
                >
                  {g.name}
                </option>

              ))}

            </select>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-6">

            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() =>
                setShowForm(false)
              }
            >

              Annuler

            </Button>

            <Button
              onClick={handleCreate}
              className="rounded-2xl bg-green-600 hover:bg-green-700"
            >

              <Check className="h-4 w-4 mr-2" />

              Créer

            </Button>

          </div>

        </div>
      )}

      {/* 🔹 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredStations.map((station) => (

          <Card
            key={station.id}
            className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group"
          >

            <CardContent className="p-0">

              {/* TOP */}
              <div className="bg-gradient-to-r from-[#0066CC] to-[#1E88E5] p-6 text-white relative overflow-hidden">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex justify-between items-start">

                  <div>

                    {editingId === station.id ? (

                      <input
                        value={editingName}
                        onChange={(e) =>
                          setEditingName(e.target.value)
                        }
                        className="bg-white text-black rounded-xl px-3 py-2 w-full"
                      />

                    ) : (

                      <h3 className="text-2xl font-bold">
                        {station.name}
                      </h3>

                    )}

                    <div className="flex items-center gap-2 mt-3 text-white/90">

                      <MapPin className="h-4 w-4" />

                      <span className="text-sm">

                        {station.ville?.name || "N/A"}

                      </span>

                    </div>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur">

                    <Building2 className="h-7 w-7 text-white" />

                  </div>

                </div>

              </div>

              {/* BODY */}
              <div className="p-6 space-y-5">

                {/* ADDRESS */}
                {editingId === station.id ? (

                  <input
                    value={editingAddress}
                    onChange={(e) =>
                      setEditingAddress(e.target.value)
                    }
                    placeholder="Adresse"
                    className="border border-gray-200 rounded-2xl px-4 py-3 w-full"
                  />

                ) : (

                  <p className="text-sm text-gray-500 leading-relaxed">

                    {station.address || "Aucune adresse renseignée"}

                  </p>

                )}

                {/* STATS */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-gray-50 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-gray-500 text-sm">

                      <Users className="h-4 w-4" />

                      Membres

                    </div>

                    <p className="text-2xl font-bold text-[#222] mt-2">

                      {station.users_count || 0}

                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-gray-500 text-sm">

                      <UserCog className="h-4 w-4" />

                      Responsable

                    </div>

                    <p className="text-sm font-semibold text-[#222] mt-2 line-clamp-1">

                      {station.responsable?.name || "Non défini"}

                    </p>

                  </div>

                </div>

                {/* RESPONSABLE EDIT */}
                {editingId === station.id && (

                  <select
                    value={editingResponsableId ?? ""}
                    onChange={(e) =>
                      setEditingResponsableId(
                        e.target.value
                          ? parseInt(e.target.value)
                          : null
                      )
                    }
                    className="border border-gray-200 rounded-2xl px-4 py-3 w-full"
                  >

                    <option value="">
                      Aucun responsable
                    </option>

                    {gestionnaires.map((g) => (

                      <option
                        key={g.id}
                        value={g.id}
                      >
                        {g.name}
                      </option>

                    ))}

                  </select>
                )}

                {/* ACTIONS */}
                <div className="flex justify-between items-center pt-2">

                  {/* LEFT */}
                  <Button
                    variant="ghost"
                    onClick={() =>
                      navigate(`/stations/${station.id}`)
                    }
                    className="rounded-2xl text-[#0066CC] hover:bg-[#0066CC]/10"
                  >

                    <Eye className="h-4 w-4 mr-2" />

                    Voir

                  </Button>

                  {/* RIGHT */}
                  <div className="flex gap-2">

                    {editingId === station.id ? (

                      <>

                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdate(station.id)
                          }
                          className="rounded-xl bg-green-600 hover:bg-green-700"
                        >

                          <Check className="h-4 w-4" />

                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setEditingId(null)
                          }
                          className="rounded-xl"
                        >

                          <X className="h-4 w-4" />

                        </Button>

                      </>

                    ) : (

                      <>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleEdit(station)
                          }
                          className="rounded-xl"
                        >

                          <Pencil className="h-4 w-4" />

                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(station.id)
                          }
                          className="rounded-xl"
                        >

                          <Trash2 className="h-4 w-4" />

                        </Button>

                      </>
                    )}

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>
        ))}

      </div>

      {/* EMPTY */}
      {filteredStations.length === 0 && (

        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-14 text-center">

          <Building2 className="h-14 w-14 mx-auto text-gray-300" />

          <h3 className="text-xl font-semibold text-gray-700 mt-4">
            Aucune station trouvée
          </h3>

          <p className="text-gray-500 mt-2">

            Essayez une autre recherche ou ajoutez une nouvelle station.

          </p>

        </div>
      )}

    </div>
  );
}