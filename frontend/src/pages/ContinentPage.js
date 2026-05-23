import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getContinents,
  createContinent,
  deleteContinent,
  updateContinent
} from "../api/continentApi";

import {
  useMessage
} from "../context/MessageContext";

import {
  Card,
  CardContent
} from "@/components/ui/card";

import {
  Button
} from "@/components/ui/button";

import {
  Input
} from "@/components/ui/input";

import {
  Badge
} from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import {
  Globe2,
  Search,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Earth
} from "lucide-react";

export default function ContinentsPage() {

  // STATES
  const [continents, setContinents] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  // CREATE
  const [name, setName] = useState("");

  // EDIT
  const [editingId, setEditingId] = useState(null);

  const [editingName, setEditingName] = useState("");

  const { showMessage } = useMessage();

  // FETCH
  const fetchData = async () => {

    try {

      const data = await getContinents();

      setContinents(data);

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
  const filteredContinents = useMemo(() => {

    return continents.filter((c) =>

      c.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [search, continents]);

  // CREATE
  const handleSubmit = async () => {

    try {

      await createContinent(name);

      setName("");

      setShowForm(false);

      showMessage(
        "Création du continent réussie !"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.message ||
        "Erreur lors de la création",
        "error"
      );
    }
  };

  // DELETE
  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Supprimer ce continent ?"
      )
    ) return;

    try {

      await deleteContinent(id);

      showMessage(
        "Suppression du continent réussie !"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.message ||
        "Erreur lors de la suppression",
        "error"
      );
    }
  };

  // EDIT
  const handleEdit = (c) => {

    setEditingId(c.id);

    setEditingName(c.name);
  };

  // UPDATE
  const handleUpdate = async (id) => {

    try {

      await updateContinent(
        id,
        editingName
      );

      setEditingId(null);

      setEditingName("");

      showMessage(
        "Modification du continent réussie !"
      );

      fetchData();

    } catch (err) {

      showMessage(
        err.message ||
        "Erreur de modification",
        "error"
      );
    }
  };

  return (

    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#00A2FF] p-8 shadow-xl">

        {/* BG ICON */}
        <div className="absolute top-0 right-0 opacity-10">

          <Earth className="w-72 h-72 text-white" />

        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* LEFT */}
          <div>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">

                <Globe2 className="h-8 w-8 text-white" />

              </div>

              <div>

                <h1 className="text-4xl font-bold text-white">

                  Continents

                </h1>

                <p className="text-blue-100 mt-1">

                  Gestion des continents de la plateforme

                </p>

              </div>

            </div>

            {/* STATS */}
            <div className="flex gap-3 mt-6">

              <Badge className="bg-white/15 text-white border-0 rounded-xl px-4 py-1">

                {continents.length} continents

              </Badge>

            </div>

          </div>

          {/* ADD BUTTON */}
          <Dialog
            open={showForm}
            onOpenChange={setShowForm}
          >

            <DialogTrigger asChild>

              <Button className="bg-white text-[#0066CC] hover:bg-blue-50 rounded-2xl h-12 px-6 font-semibold shadow">

                <Plus className="h-5 w-5 mr-2" />

                Ajouter un continent

              </Button>

            </DialogTrigger>

            {/* MODAL */}
            <DialogContent className="rounded-3xl border-0">

              <DialogHeader>

                <DialogTitle className="text-2xl">

                  Nouveau continent

                </DialogTitle>

                <DialogDescription>

                  Ajouter un nouveau continent à la plateforme

                </DialogDescription>

              </DialogHeader>

              <div className="space-y-5 mt-5">

                {/* NAME */}
                <div>

                  <label className="text-sm font-medium text-gray-700">

                    Nom du continent

                  </label>

                  <Input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Ex: Afrique"
                    className="mt-2 h-12 rounded-xl"
                  />

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
                    onClick={handleSubmit}
                    className="rounded-xl bg-[#0066CC] hover:bg-[#0055AA]"
                  >

                    Créer le continent

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
            placeholder="Rechercher un continent..."
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

        {filteredContinents.map((c) => (

          <Card
            key={c.id}
            className="group border-0 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >

            <CardContent className="p-6">

              {/* TOP */}
              <div className="flex items-start justify-between">

                <div className="w-14 h-14 rounded-2xl bg-[#0066CC]/10 flex items-center justify-center">

                  <Globe2 className="text-[#0066CC] h-6 w-6" />

                </div>

                <Badge className="bg-[#00AA55]/10 text-[#00AA55] border-0">

                  Actif

                </Badge>

              </div>

              {/* CONTENT */}
              <div className="mt-5">

                {editingId === c.id ? (

                  <Input
                    value={editingName}
                    onChange={(e) =>
                      setEditingName(
                        e.target.value
                      )
                    }
                    className="rounded-xl h-11"
                  />

                ) : (

                  <>

                    <h3 className="text-2xl font-bold text-[#111]">

                      {c.name}

                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-gray-500">

                      <Earth className="h-4 w-4" />

                      <span className="text-sm">

                        Continent actif

                      </span>

                    </div>

                  </>

                )}

              </div>

              {/* STATS */}
              <div className="mt-6">

                <div className="bg-gray-50 rounded-2xl p-5">

                  <div className="flex items-center gap-2 text-[#0066CC]">

                    <Globe2 className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      Pays associés

                    </span>

                  </div>

                  <p className="text-3xl font-bold mt-3 text-[#111]">

                    {c.pays_count || 0}

                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">

                {editingId === c.id ? (

                  <>

                    <Button
                      onClick={() =>
                        handleUpdate(c.id)
                      }
                      className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                    >

                      <Save className="h-4 w-4 mr-2" />

                      Sauvegarder

                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        setEditingId(null)
                      }
                    >

                      <X className="h-4 w-4" />

                    </Button>

                  </>

                ) : (

                  <>

                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() =>
                        handleEdit(c)
                      }
                    >

                      <Pencil className="h-4 w-4 mr-2" />

                      Modifier

                    </Button>

                    <Button
                      variant="destructive"
                      className="rounded-xl"
                      onClick={() =>
                        handleDelete(c.id)
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
      {filteredContinents.length === 0 && (

        <div className="bg-white rounded-3xl border shadow-sm p-16 text-center">

          <Globe2 className="mx-auto h-14 w-14 text-gray-300" />

          <h3 className="mt-4 text-xl font-semibold text-[#111]">

            Aucun continent trouvé

          </h3>

          <p className="text-gray-500 mt-2">

            Essayez une autre recherche ou créez un nouveau continent.

          </p>

        </div>

      )}

    </div>
  );
}