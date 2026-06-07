import {useEffect,useMemo,useState} from "react";
import { getPays, createPays, deletePays, updatePays} from "../api/paysApi";
import {getContinents} from "../api/continentApi";
import {useMessage} from "../context/MessageContext";
import { Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import {Globe2,Map,Search,Pencil,Trash2,Plus,Save,X,Landmark, ChevronRight, ChevronLeft} from "lucide-react";


export default function PaysPage() {

  // STATES
  const [pays, setPays] = useState([]);
  const [continents, setContinents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  // CREATE
  const [name, setName] = useState("");
  const [continentId, setContinentId] = useState("");

  // EDIT
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingContinentId, setEditingContinentId] = useState("");
  const { showMessage } = useMessage();

  // FETCH
  const fetchData = async (currentPage = 1) => {

    try {

      const p = await getPays(currentPage);

      const c = await getContinents();

      setPays(p.data);

      setContinents(c);

      setPage(p.current_page || 1);
  
      setLastPage(p.last_page || 1);

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
  const filteredPays = useMemo(() => {

    return pays.filter((p) =>

      p.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [search, pays]);

  // CREATE
  const handleSubmit = async () => {

    try {

      await createPays({

        name,

        continent_id: Number(continentId)
      });

      setName("");

      setContinentId("");

      setShowForm(false);

      showMessage(
        "Création du pays réussie"
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
        "Supprimer ce pays ?"
      )
    ) return;

    try {

      await deletePays(id);

      showMessage(
        "Pays supprimé avec succès"
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
  const handleEdit = (p) => {

    setEditingId(p.id);

    setEditingName(p.name);

    setEditingContinentId(
      String(p.continent_id)
    );
  };

  // UPDATE
  const handleUpdate = async (id) => {

    try {

      await updatePays(id, {

        name: editingName,

        continent_id: Number(
          editingContinentId
        )
      });

      setEditingId(null);

      setEditingName("");

      setEditingContinentId("");

      showMessage(
        "Pays modifié avec succès"
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#00A2FF] p-8 shadow-xl">

        <div className="absolute top-0 right-0 opacity-10">

          <Globe2 className="w-72 h-72 text-white" />

        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* LEFT */}
          <div>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">

                <Landmark className="h-8 w-8 text-white" />

              </div>

              <div>

                <h1 className="text-4xl font-bold text-white">

                  Pays

                </h1>

                <p className="text-blue-100 mt-1">

                  Gestion des pays et continents

                </p>

              </div>

            </div>

            {/* STATS */}
            <div className="flex gap-3 mt-6">

              <Badge className="bg-white/15 text-white border-0 rounded-xl px-4 py-1">

                {pays.length} pays

              </Badge>

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

                Ajouter un pays

              </Button>

            </DialogTrigger>

            {/* MODAL */}
            <DialogContent className="rounded-3xl border-0">

              <DialogHeader>

                <DialogTitle className="text-2xl">

                  Nouveau pays

                </DialogTitle>

                <DialogDescription>

                  Ajouter un nouveau pays à la plateforme

                </DialogDescription>

              </DialogHeader>

              <div className="space-y-5 mt-5">

                {/* NAME */}
                <div>

                  <label className="text-sm font-medium text-gray-700">

                    Nom du pays

                  </label>

                  <Input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Ex: France"
                    className="mt-2 h-12 rounded-xl"
                  />

                </div>

                {/* CONTINENT */}
                <div>

                  <label className="text-sm font-medium text-gray-700">

                    Continent

                  </label>

                  <Select
                    value={continentId}
                    onValueChange={setContinentId}
                  >

                    <SelectTrigger className="mt-2 h-12 rounded-xl">

                      <SelectValue placeholder="Choisir un continent" />

                    </SelectTrigger>

                    <SelectContent>

                      {continents.map((c) => (

                        <SelectItem
                          key={c.id}
                          value={String(c.id)}
                        >

                          {c.name}

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
                    onClick={handleSubmit}
                    className="rounded-xl bg-[#0066CC] hover:bg-[#0055AA]"
                  >

                    Créer le pays

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
            placeholder="Rechercher un pays..."
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

        {filteredPays.map((p) => (

          <Card
            key={p.id}
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

                {editingId === p.id ? (

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
                      value={editingContinentId}
                      onValueChange={
                        setEditingContinentId
                      }
                    >

                      <SelectTrigger className="rounded-xl h-11">

                        <SelectValue />

                      </SelectTrigger>

                      <SelectContent>

                        {continents.map((c) => (

                          <SelectItem
                            key={c.id}
                            value={String(c.id)}
                          >

                            {c.name}

                          </SelectItem>

                        ))}

                      </SelectContent>

                    </Select>

                  </div>

                ) : (

                  <>

                    <h3 className="text-2xl font-bold text-[#111]">

                      {p.name}

                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-gray-500">

                      <Map className="h-4 w-4" />

                      <span className="text-sm">

                        {p.continent?.name ||
                          "Aucun continent"}

                      </span>

                    </div>

                  </>

                )}

              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-4 mt-6">

                <div className="bg-gray-50 rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-[#0066CC]">

                    <Map className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      Villes

                    </span>

                  </div>

                  <p className="text-2xl font-bold mt-2 text-[#111]">

                    {p.villes_count || 0}

                  </p>

                </div>

                <div className="bg-gray-50 rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-[#00AA55]">

                    <Globe2 className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      Continent

                    </span>

                  </div>

                  <p className="text-lg font-semibold mt-2 text-[#111] truncate">

                    {p.continent?.name || "N/A"}

                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">

                {editingId === p.id ? (

                  <>

                    <Button
                      onClick={() =>
                        handleUpdate(p.id)
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
                        handleEdit(p)
                      }
                    >

                      <Pencil className="h-4 w-4 mr-2" />

                      Modifier

                    </Button>

                    <Button
                      variant="destructive"
                      className="rounded-xl"
                      onClick={() =>
                        handleDelete(p.id)
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

           {/* 🔹 PAGINATION */}
           <div className="flex items-center justify-between px-6 py-4 border-t bg-white">

         <Button variant="outline" disabled={page === 1} onClick={() => { const newPage = page - 1; setPage(newPage); fetchData(newPage); }} className="rounded-xl">
                <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-gray-600">
             Page {" "}
            <span className="font-semibold">{page}</span>{" "}sur{" "} <span className="font-semibold">  {lastPage} </span>
          </div>

          <Button variant="outline" disabled={page === lastPage} onClick={() => { const newPage = page + 1; setPage(newPage); fetchData(newPage); }} className="rounded-xl">
               <ChevronRight className="h-4 w-4 text-gray-500" />
          </Button>

      </div>

      {/* EMPTY */}
      {filteredPays.length === 0 && (

        <div className="bg-white rounded-3xl border shadow-sm p-16 text-center">

          <Globe2 className="mx-auto h-14 w-14 text-gray-300" />

          <h3 className="mt-4 text-xl font-semibold text-[#111]">

            Aucun pays trouvé

          </h3>

          <p className="text-gray-500 mt-2">

            Essayez une autre recherche ou créez un nouveau pays.

          </p>

        </div>

      )}

    </div>
  );
}