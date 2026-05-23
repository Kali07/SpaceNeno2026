import {
  Card,
  CardContent
} from '@/components/ui/card';

import {
  Button
} from '@/components/ui/button';

import {
  Input
} from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  Badge
} from '@/components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';

import {
  Map,
  MapPin,
  Users,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Globe2,
  Search
} from 'lucide-react';

import {
  getVilles,
  createVille,
  deleteVille,
  updateVille
} from '../api/villeApi';

import {
  getPays
} from "../api/paysApi";

import {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  useMessage
} from "../context/MessageContext";

export default function VillesPage() {

  // STATES
  const [villes, setVilles] = useState([]);

  const [paysList, setPaysList] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  // CREATE
  const [name, setName] = useState("");

  const [paysId, setPaysId] = useState("");

  // EDIT
  const [editingId, setEditingId] = useState(null);

  const [editingName, setEditingName] = useState("");

  const [editingPaysId, setEditingPaysId] = useState("");

  const { showMessage } = useMessage();

  // FETCH
  const fetchData = async () => {

    try {

      const v = await getVilles();

      const p = await getPays();

      setVilles(v);

      setPaysList(p);

    } catch (err) {

      showMessage(
        "Erreur chargement données",
        "error"
      );
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // FILTER
  const filteredVilles = useMemo(() => {

    return villes.filter((ville) =>

      ville.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [search, villes]);

  // CREATE
  const handleCreate = async () => {

    try {

      await createVille({

        name,

        pays_id: Number(paysId)
      });

      setName("");

      setPaysId("");

      setShowForm(false);

      showMessage(
        "Ville créée avec succès"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.message ||
        "Erreur création",
        "error"
      );
    }
  };

  // DELETE
  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Supprimer cette ville ?"
      )
    ) return;

    try {

      await deleteVille(id);

      showMessage(
        "Ville supprimée"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.message ||
        "Erreur suppression",
        "error"
      );
    }
  };

  // EDIT
  const handleEdit = (ville) => {

    setEditingId(ville.id);

    setEditingName(ville.name);

    setEditingPaysId(
      String(ville.pays_id)
    );
  };

  // UPDATE
  const handleUpdate = async (id) => {

    try {

      await updateVille(id, {

        name: editingName,

        pays_id: Number(editingPaysId)
      });

      setEditingId(null);

      setEditingName("");

      setEditingPaysId("");

      showMessage(
        "Ville modifiée avec succès"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.message ||
        "Erreur modification",
        "error"
      );
    }
  };

  return (

    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0066CC] to-[#0084FF] p-8 shadow-xl">

        <div className="absolute top-0 right-0 opacity-10">

          <Building2 className="w-72 h-72 text-white" />

        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">

                <Map className="text-white h-7 w-7" />

              </div>

              <div>

                <h1 className="text-4xl font-bold text-white">

                  Villes

                </h1>

                <p className="text-blue-100 mt-1">

                  Gestion des villes et des communautés

                </p>

              </div>

            </div>

            <div className="flex gap-3 mt-6">

              <Badge className="bg-white/15 text-white border-0 px-4 py-1 rounded-xl">

                {villes.length} villes

              </Badge>

              <Badge className="bg-white/15 text-white border-0 px-4 py-1 rounded-xl">

                {paysList.length} pays

              </Badge>

            </div>

          </div>

          <Dialog
            open={showForm}
            onOpenChange={setShowForm}
          >

            <DialogTrigger asChild>

              <Button className="bg-white text-[#0066CC] hover:bg-blue-50 rounded-2xl h-12 px-6 font-semibold shadow">

                <Plus className="h-5 w-5 mr-2" />

                Ajouter une ville

              </Button>

            </DialogTrigger>

            <DialogContent className="rounded-3xl border-0">

              <DialogHeader>

                <DialogTitle className="text-2xl">

                  Nouvelle ville

                </DialogTitle>

                <DialogDescription>

                  Ajouter une nouvelle ville à la plateforme

                </DialogDescription>

              </DialogHeader>

              <div className="space-y-5 mt-5">

                {/* NOM */}
                <div>

                  <label className="text-sm font-medium text-gray-700">

                    Nom de la ville

                  </label>

                  <Input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Ex: Kinshasa"
                    className="mt-2 h-12 rounded-xl"
                  />

                </div>

                {/* PAYS */}
                <div>

                  <label className="text-sm font-medium text-gray-700">

                    Pays

                  </label>

                  <Select
                    value={paysId}
                    onValueChange={setPaysId}
                  >

                    <SelectTrigger className="mt-2 h-12 rounded-xl">

                      <SelectValue placeholder="Choisir un pays" />

                    </SelectTrigger>

                    <SelectContent>

                      {paysList.map((p) => (

                        <SelectItem
                          key={p.id}
                          value={String(p.id)}
                        >

                          {p.name}

                        </SelectItem>

                      ))}

                    </SelectContent>

                  </Select>

                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">

                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >

                    Annuler

                  </Button>

                  <Button
                    onClick={handleCreate}
                    className="rounded-xl bg-[#0066CC] hover:bg-[#0055AA]"
                  >

                    Créer la ville

                  </Button>

                </div>

              </div>

            </DialogContent>

          </Dialog>

        </div>

      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl border shadow-sm p-4">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Rechercher une ville..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-11 h-12 rounded-xl border-0 bg-gray-50"
          />

        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredVilles.map((ville) => (

          <Card
            key={ville.id}
            className="group border-0 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >

            <CardContent className="p-6">

              {/* TOP */}
              <div className="flex items-start justify-between">

                <div className="w-14 h-14 rounded-2xl bg-[#0066CC]/10 flex items-center justify-center">

                  <MapPin className="text-[#0066CC] h-6 w-6" />

                </div>

                <Badge className="bg-[#00AA55]/10 text-[#00AA55] border-0">

                  Active

                </Badge>

              </div>

              {/* CONTENT */}
              <div className="mt-5">

                {editingId === ville.id ? (

                  <div className="space-y-3">

                    <Input
                      value={editingName}
                      onChange={(e) =>
                        setEditingName(
                          e.target.value
                        )
                      }
                      className="rounded-xl h-11"
                    />

                    <Select
                      value={editingPaysId}
                      onValueChange={
                        setEditingPaysId
                      }
                    >

                      <SelectTrigger className="rounded-xl h-11">

                        <SelectValue />

                      </SelectTrigger>

                      <SelectContent>

                        {paysList.map((p) => (

                          <SelectItem
                            key={p.id}
                            value={String(p.id)}
                          >

                            {p.name}

                          </SelectItem>

                        ))}

                      </SelectContent>

                    </Select>

                  </div>

                ) : (

                  <>

                    <h3 className="text-xl font-bold text-[#111]">

                      {ville.name}

                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-gray-500">

                      <Globe2 className="h-4 w-4" />

                      <span className="text-sm">

                        {ville.pays?.name ||
                          "Aucun pays"}

                      </span>

                    </div>

                  </>

                )}

              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-4 mt-6">

                <div className="bg-gray-50 rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-[#0066CC]">

                    <MapPin className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      Stations

                    </span>

                  </div>

                  <p className="text-2xl font-bold mt-2 text-[#111]">

                    {ville.stationCount || 0}

                  </p>

                </div>

                <div className="bg-gray-50 rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-[#00AA55]">

                    <Users className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      Membres

                    </span>

                  </div>

                  <p className="text-2xl font-bold mt-2 text-[#111]">

                    {ville.memberCount || 0}

                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">

                {editingId === ville.id ? (

                  <>

                    <Button
                      onClick={() =>
                        handleUpdate(ville.id)
                      }
                      className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                    >

                      Sauvegarder

                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        setEditingId(null)
                      }
                    >

                      Annuler

                    </Button>

                  </>

                ) : (

                  <>

                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() =>
                        handleEdit(ville)
                      }
                    >

                      <Pencil className="h-4 w-4 mr-2" />

                      Modifier

                    </Button>

                    <Button
                      variant="destructive"
                      className="rounded-xl"
                      onClick={() =>
                        handleDelete(ville.id)
                      }
                    >

                      <Trash2 className="h-4 w-4" />

                    </Button>

                  </>

                )}

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

      {/* EMPTY */}
      {filteredVilles.length === 0 && (

        <div className="bg-white rounded-3xl border shadow-sm p-16 text-center">

          <Map className="mx-auto h-14 w-14 text-gray-300" />

          <h3 className="mt-4 text-xl font-semibold text-[#111]">

            Aucune ville trouvée

          </h3>

          <p className="text-gray-500 mt-2">

            Essayez une autre recherche ou créez une nouvelle ville.

          </p>

        </div>

      )}

    </div>
  );
}