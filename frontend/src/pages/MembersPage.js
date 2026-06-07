import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {createUser,getUsers} from "@/api/userApi";
import { getStations } from '@/api/stationApi';
import { getRoles } from '@/api/roleApi';
import { getGenerations } from '@/api/generationApi';
import { useAuth } from '@/context/AuthContext';
import { useMessage } from "../context/MessageContext";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {Avatar,AvatarImage,AvatarFallback} from '@/components/ui/avatar';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '@/components/ui/table';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,DialogTrigger} from '@/components/ui/dialog';
import { Search, Plus, UserPlus, Eye, Users, UserCheck, UserX, Sparkles, Mail, Building2, ChevronLeft, ChevronRight } from 'lucide-react';


export default function MembersPage() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const { showMessage } = useMessage();

  // 🔹 STATES
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [stations, setStations] = useState([]);

  const [roles, setRoles] = useState([]);

  const [generations, setGenerations] = useState([]);

  const [search, setSearch] = useState('');

  const [filterStation, setFilterStation] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterGeneration, setFilterGeneration] = useState('all');

  const [dialogOpen, setDialogOpen] = useState(false);

  // 🔹 NEW MEMBER
  const [newMember, setNewMember] = useState({

    firstName: '',

    lastName: '',

    email: '',

    sexe: '',

    phone: '',

    station: '',

    generation: '',

    role: ''
  });

  // 🔹 FETCH USERS
  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async (currentPage = 1) => {
    try {
  
      const response = await getUsers(currentPage);
  
      const s = await getStations();
  
      const r = await getRoles();
  
      const g = await getGenerations();
  
      setUsers(response.data || []);
  
      setPage(response.current_page || 1);
  
      setLastPage(response.last_page || 1);
  
      setStations(s);
  
      setRoles(r);
  
      setGenerations(g);
  
    } catch (err) {
    
      showMessage(
        "Erreur lors du chargement",
        "error"
      );
    }
  };

  // 🔹 FORMAT USERS
  const formattedUsers = users.map(user => ({

    id: user.id,

    firstName: user.name,

    lastName: "",

    email: user.email,

    sexe: user.sexe,

    phone: user.phone,

    station: user.station?.name,

    stationId: String(user.station_id),

    generation: user.generation?.label,

    generationId: String(user.generation_id),

    role: user.role,

    roleLabel: user.role?.label,

    status: user.statut?.label || "active",

    avatar: null
  }));

  // 🔹 FILTER USERS
  const filteredMembers = useMemo(() => {

    return formattedUsers.filter((m) => {

      const matchSearch =
        search === '' ||

        `${m.firstName} ${m.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        m.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStation =
        filterStation === 'all' ||
        m.stationId === filterStation;

      const matchStatus =
        filterStatus === 'all' ||
        m.status === filterStatus;

      const matchRole =
        !user?.role ||
        !m.role
          ? true
          : m.role.level <= user.role.level;

      const matchGen =
        filterGeneration === 'all' ||
        m.generationId === filterGeneration;

      return (
        matchSearch &&
        matchStation &&
        matchStatus &&
        matchGen &&
        matchRole
      );

    });

  }, [
    formattedUsers,
    search,
    filterStation,
    filterStatus,
    filterGeneration,
    user
  ]);

  // 🔹 STATS
  const stats = {

    total: filteredMembers.length,

    active: filteredMembers.filter(
      m => m.status === 'active'
    ).length,

    inactive: filteredMembers.filter(
      m => m.status !== 'active'
    ).length
  };

  // 🔹 ADD MEMBER
  const handleAddMember = async (e) => {

    e.preventDefault();

    try {

      const result =await createUser({

        name:
          newMember.firstName +
          " " +
          newMember.lastName,

        email: newMember.email,

        sexe: newMember.sexe,

        phone: newMember.phone,

        password: "12345678",

        role_id: Number(newMember.role),

        station_id: Number(newMember.station),

        generation_id: Number(newMember.generation)
      });

      showMessage(
        result.message ||
        "Utilisateur créé avec succès"
      );

      setDialogOpen(false);

      setNewMember({

        firstName: '',

        lastName: '',

        email: '',

        sexe: '',

        phone: '',

        station: '',

        generation: '',

        role: ''
      });

      fetchUsers();

    } catch (err) {

      showMessage(
        err.message|| "error");
    }
  };

  return (

    <div className="space-y-8">

      {/* 🔹 HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0055AA] via-[#0066CC] to-[#1E88E5] text-white shadow-xl">

        <div className="absolute inset-0">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        </div>

        <div className="relative z-10 p-8 md:p-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div>

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">

                  <Sparkles className="h-8 w-8 text-white" />

                </div>

                <div>

                  <h1 className="text-3xl md:text-4xl font-bold">
                    Membres
                  </h1>

                  <p className="text-white/80 mt-1">
                    Gestion complète des membres de la communauté
                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="grid grid-cols-3 gap-4">

              <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4 min-w-[120px]">

                <div className="flex items-center gap-2 text-white/70 text-sm">

                  <Users className="h-4 w-4" />

                  Total

                </div>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.total}
                </h2>

              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4 min-w-[120px]">

                <div className="flex items-center gap-2 text-white/70 text-sm">

                  <UserCheck className="h-4 w-4" />

                  Actifs

                </div>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.active}
                </h2>

              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4 min-w-[120px]">

                <div className="flex items-center gap-2 text-white/70 text-sm">

                  <UserX className="h-4 w-4" />

                  Inactifs

                </div>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.inactive}
                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 🔹 TOP BAR */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">

        {/* SEARCH */}
        <div className="relative w-full lg:max-w-md">

          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-11 h-12 rounded-2xl border-gray-200"
          />

        </div>

        {/* ADD BUTTON */}
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >

            { user?.role && user.role.level >= 2 && (

          <DialogTrigger asChild>

                <Button className="h-12 rounded-2xl bg-[#0066CC] hover:bg-[#0055AA]">

                  <Plus className="h-4 w-4 mr-2" />

                    Ajouter un membre

                </Button>

           </DialogTrigger>

                )}

          {/* 🔹 DIALOG */}
          <DialogContent className="sm:max-w-[650px] rounded-3xl">

            <DialogHeader>

              <DialogTitle className="flex items-center gap-2 text-2xl">

                <UserPlus className="h-6 w-6 text-[#0066CC]" />

                Nouveau membre

              </DialogTitle>

              <DialogDescription>

                Remplissez les informations du membre.

              </DialogDescription>

            </DialogHeader>

            <form
              onSubmit={handleAddMember}
              className="space-y-5 mt-4"
            >

              {/* NAMES */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <Label>Prénom</Label>

                  <Input
                    value={newMember.firstName}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        firstName: e.target.value
                      })
                    }
                    className="mt-2 rounded-xl"
                    required
                  />

                </div>

                <div>

                  <Label>Nom</Label>

                  <Input
                    value={newMember.lastName}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        lastName: e.target.value
                      })
                    }
                    className="mt-2 rounded-xl"
                    required
                  />

                </div>

              </div>

              {/* EMAIL + PHONE */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <Label>Email</Label>

                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        email: e.target.value
                      })
                    }
                    className="mt-2 rounded-xl"
                    required
                  />

                </div>

                <div>

                  <Label>Téléphone</Label>

                  <Input
                    value={newMember.phone}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        phone: e.target.value
                      })
                    }
                    className="mt-2 rounded-xl"
                  />

                </div>

              </div>

              {/* SEXE + ROLE */}
              <div className="grid grid-cols-2 gap-4">

                {/* SEXE */}
                <div>

                  <Label>Sexe</Label>

                  <Select
                    value={newMember.sexe}
                    onValueChange={(v) =>
                      setNewMember({
                        ...newMember,
                        sexe: v
                      })
                    }
                  >

                    <SelectTrigger className="mt-2 rounded-xl">

                      <SelectValue placeholder="Choisir un sexe" />

                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="Masculin">
                        Masculin
                      </SelectItem>

                      <SelectItem value="Feminin">
                        Féminin
                      </SelectItem>

                    </SelectContent>

                  </Select>

                </div>

                {/* ROLE */}
                <div>

                  <Label>Rôle</Label>

                  <Select
                     value={newMember.role}
                       onValueChange={(v) =>
                        setNewMember({
                        ...newMember,
                          role: v
                            })
                            }>

                    <SelectTrigger className="mt-2 rounded-xl">

                      <SelectValue placeholder="Choisir un rôle" />

                     </SelectTrigger>

                     <SelectContent>

                            {roles
                              .filter( (r) => r.level < user?.role?.level).map((r) => (

                     <SelectItem
                       key={r.id}
                        value={String(r.id)}
                      >

                        {r.label}

                     </SelectItem>

                              ))}

                       </SelectContent>

                  </Select>
                </div>

              </div>

              {/* STATION + GENERATION */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <Label>Station</Label>

                  <Select
                    value={newMember.station}
                    onValueChange={(v) =>
                      setNewMember({
                        ...newMember,
                        station: v
                      })
                    }
                  >

                    <SelectTrigger className="mt-2 rounded-xl">

                      <SelectValue placeholder="Choisir une station" />

                    </SelectTrigger>

                    <SelectContent>

                      {stations.map((s) => (

                        <SelectItem
                          key={s.id}
                          value={String(s.id)}
                        >

                          {s.name}

                        </SelectItem>

                      ))}

                    </SelectContent>

                  </Select>

                </div>

                <div>

                  <Label>Génération</Label>

                  <Select
                    value={newMember.generation}
                    onValueChange={(v) =>
                      setNewMember({
                        ...newMember,
                        generation: v
                      })
                    }
                  >

                    <SelectTrigger className="mt-2 rounded-xl">

                      <SelectValue placeholder="Choisir une génération" />

                    </SelectTrigger>

                    <SelectContent>

                      {generations.map((g) => (

                        <SelectItem
                          key={g.id}
                          value={String(g.id)}
                        >

                          {g.label}

                        </SelectItem>

                      ))}

                    </SelectContent>

                  </Select>

                </div>

              </div>

              {/* FOOTER */}
              <DialogFooter className="pt-4">

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() =>
                    setDialogOpen(false)
                  }
                >

                  Annuler

                </Button>

                <Button
                  type="submit"
                  className="rounded-xl bg-green-600 hover:bg-green-700"
                >

                  Ajouter le membre

                </Button>

              </DialogFooter>

            </form>

          </DialogContent>

        </Dialog>

      </div>

      {/* 🔹 FILTERS */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* STATION */}
          <Select
            value={filterStation}
            onValueChange={setFilterStation}
          >

            <SelectTrigger className="rounded-2xl h-12">

              <SelectValue placeholder="Stations" />

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                Toutes les stations
              </SelectItem>

              {stations.map((s) => (

                <SelectItem
                  key={s.id}
                  value={String(s.id)}
                >

                  {s.name}

                </SelectItem>

              ))}

            </SelectContent>

          </Select>

          {/* STATUS */}
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >

            <SelectTrigger className="rounded-2xl h-12">

              <SelectValue placeholder="Statut" />

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                Tous les statuts
              </SelectItem>

              <SelectItem value="active">
                Actif
              </SelectItem>

              <SelectItem value="inactive">
                Inactif
              </SelectItem>

            </SelectContent>

          </Select>

          {/* GENERATION */}
          <Select
            value={filterGeneration}
            onValueChange={setFilterGeneration}
          >

            <SelectTrigger className="rounded-2xl h-12">

              <SelectValue placeholder="Génération" />

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                Toutes les générations
              </SelectItem>

              {generations.map((g) => (

                <SelectItem
                  key={g.id}
                  value={String(g.id)}
                >

                  {g.label}

                </SelectItem>

              ))}

            </SelectContent>

          </Select>

        </div>

      </div>

      {/* 🔹 TABLE */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        <Table>

          <TableHeader>

            <TableRow className="bg-[#F8FAFC]">

              <TableHead>Membre</TableHead>

              <TableHead>Sexe</TableHead>

              <TableHead>Station</TableHead>

              <TableHead>Génération</TableHead>

              <TableHead>Rôle</TableHead>

              <TableHead>Statut</TableHead>

              <TableHead className="text-right">
                Action
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {filteredMembers.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >

                  Aucun membre trouvé.

                </TableCell>

              </TableRow>

            ) : (

              filteredMembers.map((member) => (

                <TableRow
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors"
                >

                  {/* MEMBER */}
                  <TableCell>

                    <div className="flex items-center gap-4">

                      <Avatar className="h-11 w-11">

                        <AvatarImage src={member.avatar} />

                        <AvatarFallback className="bg-[#0066CC]/10 text-[#0066CC] font-semibold">

                          {member.firstName[0]}
                          {member.lastName[0]}

                        </AvatarFallback>

                      </Avatar>

                      <div>

                        <p className="font-semibold text-[#222]">

                          {member.firstName} {member.lastName}

                        </p>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

                          <Mail className="h-4 w-4" />

                          {member.email}

                        </div>

                      </div>

                    </div>

                  </TableCell>

                  {/* SEXE */}
                  <TableCell>

                    <Badge
                      variant="outline"
                      className="rounded-xl"
                    >

                      {member.sexe || "N/A"}

                    </Badge>

                  </TableCell>

                  {/* STATION */}
                  <TableCell>

                    <div className="flex items-center gap-2">

                      <Building2 className="h-4 w-4 text-gray-400" />

                      {member.station}

                    </div>

                  </TableCell>

                  {/* GENERATION */}
                  <TableCell>

                    <Badge className="bg-[#0066CC]/10 text-[#0066CC] rounded-xl border-0">

                      {member.generation}

                    </Badge>

                  </TableCell>

                  {/* ROLE */}
                  <TableCell>

                    <span className="text-sm text-gray-600">

                      {member.roleLabel}

                    </span>

                  </TableCell>

                  {/* STATUS */}
                  <TableCell>

                    <Badge
                      className={`rounded-xl border-0 ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >

                      {member.status}

                    </Badge>

                  </TableCell>

                  {/* ACTION */}
                  <TableCell className="text-right">

                    {(!user?.role ||
                      !member.role ||
                      member.role.level < user.role.level) && (

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/members/${member.id}`)
                        }
                        className="rounded-xl text-[#0066CC] hover:bg-[#0066CC]/10"
                      >

                        <Eye className="h-4 w-4 mr-2" />

                        Voir

                      </Button>

                    )}

                  </TableCell>

                </TableRow>

              ))
            )}

          </TableBody>

        </Table>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-[#FAFAFA]">

          <p className="text-sm text-gray-500">

            Affichage de
            {" "}
            <span className="font-semibold text-[#222]">
              {filteredMembers.length}
            </span>
            {" "}
            membre(s)

          </p>

          {/* 🔹 PAGINATION */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-white">

         <Button variant="outline" disabled={page === 1} onClick={() => { const newPage = page - 1; setPage(newPage); fetchUsers(newPage); }} className="rounded-xl">
                <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-gray-600">
             Page {" "}
            <span className="font-semibold">{page}</span>{" "}sur{" "} <span className="font-semibold">  {lastPage} </span>
          </div>

          <Button variant="outline" disabled={page === lastPage} onClick={() => { const newPage = page + 1; setPage(newPage); fetchUsers(newPage); }} className="rounded-xl">
               <ChevronRight className="h-4 w-4 text-gray-500" />
          </Button>

        </div>

        </div>

      </div>

    </div>
  );
}