import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMembers, mockStations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, UserPlus, Eye } from 'lucide-react';
import { useEffect } from "react";
import { createUser, getUsers } from "@/api/userApi"; // vérifie le path
import { useAuth } from '@/context/AuthContext';

export default function MembersPage() {// composant pour afficher la liste des membres de la communauté, avec des filtres et une fonctionnalité d'ajout de membre
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStation, setFilterStation] = useState('all');
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGeneration, setFilterGeneration] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);// état pour contrôler l'ouverture du dialogue d'ajout de membre
  const [newMember, setNewMember] = useState({ firstName: '', lastName: '', email: '', phone: '', station: '', generation: 'G1' });// état pour stocker les informations du nouveau membre à ajouter
  const { user } = useAuth();// récupère l'utilisateur actuellement connecté à partir du contexte d'authentification
  const canView = !user?.role || !user.role || user.role.level <= user.role.level;// vérifie si l'utilisateur a le droit de voir les détails d'un membre basé sur la hiérarchie des rôles

  useEffect(() => {// effet pour charger les utilisateurs depuis le backend lorsque le composant est monté
    fetchUsers();
  }, []);

  const fetchUsers = async () => {// fonction pour récupérer les utilisateurs depuis le backend
    const data = await getUsers();
    setUsers(data);
  };

  const formattedUsers = users.map(user => ({// formate les données des utilisateurs pour les adapter à l'affichage dans la table
    id: user.id,
    firstName: user.name,
    lastName: "",
    email: user.email,
    station: user.station?.label || "N/A",
    stationId: user.station_id,
    generation: "N/A", // Placeholder, replace with actual data if available
    role: user.role,          
   roleLabel: user.role?.label,
    status: "active",
    avatar: null
  }));

  const filteredMembers = useMemo(() => {// mémorise les membres filtrés pour éviter les recalculs inutiles à chaque rendu
    return formattedUsers.filter((m) => {// filtre les membres en fonction des critères de recherche, de station, de statut, de génération et de rôle
      const matchSearch = search === '' ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase());
      const matchStation = filterStation === 'all' || m.stationId === filterStation;
      const matchStatus = filterStatus === 'all' || m.status === filterStatus;
      const matchRole = !user?.role || !m.role ? true: m.role.level <= user.role.level;
      const matchGen = filterGeneration === 'all' || m.generation === filterGeneration;
     // console.log("MEMBER:", m);
      return matchSearch && matchStation && matchStatus && matchGen && matchRole;// retourne true si le membre correspond à tous les critères de filtrage, sinon retourne false
    });
  }, [formattedUsers, search, filterStation, filterStatus, filterGeneration]);// dépendances pour recalculer les membres filtrés lorsque l'une de ces valeurs change


  const handleAddMember = async (e) => {// fonction pour gérer l'ajout d'un nouveau membre lorsque le formulaire est soumis
    e.preventDefault();

    try {// envoie une requête au backend pour créer un nouvel utilisateur avec les informations du nouveau membre
      const res = await createUser({
        name: newMember.firstName + " " + newMember.lastName,
        email: newMember.email,
        password: "123456", // temporaire à changer pour une vraie gestion de mot de passe
        role_id: newMember.role || 1,
      });

      console.log("RESPONSE BACKEND :", res);// à supprimer, affiche la réponse du backend dans la console pour vérifier que l'utilisateur a été créé avec succès

      setDialogOpen(false);// réinitialise le formulaire d'ajout de membre

      fetchUsers();// recharge la liste des utilisateurs pour afficher le nouveau membre ajouté

    } catch (err) {
      console.error(err);// affiche une erreur dans la console si la requête échoue
    }
  };

  return (// rendu du composant avec la structure de la page, les filtres et la table d'affichage des membres
    <div className="space-y-6" data-testid="members-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[#333333]">Membres</h1>
          <p className="text-sm text-[#666666] mt-1">{mockMembers.length} total membres dans votre communauté</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0066CC] hover:bg-[#0055AA] text-white" data-testid="add-member-btn">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un Membre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]" data-testid="add-member-dialog">
            <DialogHeader>
              <DialogTitle className="font-heading flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#0066CC]" /> Ajouter un Nouveau Membre
              </DialogTitle>
              <DialogDescription>Remplissez les détails du membre ci-dessous.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#333333]">Prénom</Label>
                  <Input value={newMember.firstName} onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })} required data-testid="new-member-firstname" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#333333]">Nom</Label>
                  <Input value={newMember.lastName} onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })} required data-testid="new-member-lastname" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#333333]">Email</Label>
                <Input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} required data-testid="new-member-email" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#333333]">Téléphone</Label>
                <Input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} data-testid="new-member-phone" />
              </div>
              <div className="space-y-1.5">
                      <Label>Rôle</Label>
                          <Select value={newMember.role} onValueChange={(v) => setNewMember({ ...newMember, role: v })}>
                      <SelectTrigger>
                     <SelectValue placeholder="Choisir un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="1">Membre</SelectItem>
                  <SelectItem value="2">Gestionnaire</SelectItem>
                  <SelectItem value="3">Admin_provincial</SelectItem>
                  <SelectItem value="4">Admin_national</SelectItem>
                  <SelectItem value="5">Admin_fonctionnel</SelectItem>
              
                 </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#333333]">Station</Label>
                  <Select value={newMember.station} onValueChange={(v) => setNewMember({ ...newMember, station: v })}>
                    <SelectTrigger data-testid="new-member-station">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStations.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#333333]">Generation</Label>
                  <Select value={newMember.generation} onValueChange={(v) => setNewMember({ ...newMember, generation: v })}>
                    <SelectTrigger data-testid="new-member-generation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="G1">G1</SelectItem>
                      <SelectItem value="G2">G2</SelectItem>
                      <SelectItem value="G3">G3</SelectItem>
                      <SelectItem value="G4">G4</SelectItem>
                      <SelectItem value="G4-P1">G4-P1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} data-testid="cancel-add-member-btn">Annuler</Button>
                <Button type="submit" className="bg-[#00AA55] hover:bg-[#009944] text-white" data-testid="submit-add-member-btn">Ajouter un Membre</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" data-testid="members-filters">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#F5F5F5]"
              data-testid="members-search-input"
            />
          </div>
          <Select value={filterStation} onValueChange={setFilterStation}>
            <SelectTrigger data-testid="filter-station">
              <SelectValue placeholder="All Stations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les Stations</SelectItem>
              {mockStations.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger data-testid="filter-status">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les Statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterGeneration} onValueChange={setFilterGeneration}>
            <SelectTrigger data-testid="filter-generation">
              <SelectValue placeholder="All Generations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les Générations</SelectItem>
              <SelectItem value="G1">G1</SelectItem>
              <SelectItem value="G2">G2</SelectItem>
              <SelectItem value="G3">G3</SelectItem>
              <SelectItem value="G4">G4</SelectItem>
              <SelectItem value="G4-P1">G4-P1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <Table data-testid="members-table">
          <TableHeader>
            <TableRow className="bg-[#F5F5F5]">
              <TableHead className="font-semibold text-[#333333]">Membre</TableHead>
              <TableHead className="font-semibold text-[#333333]">Station</TableHead>
              <TableHead className="font-semibold text-[#333333] hidden md:table-cell">Génération</TableHead>
              <TableHead className="font-semibold text-[#333333] hidden lg:table-cell">Rôle</TableHead>
              <TableHead className="font-semibold text-[#333333]">Statut</TableHead>
              <TableHead className="font-semibold text-[#333333] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-[#666666]">
                 Aucun membre trouvé correspondant à vos critères.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50 cursor-pointer" data-testid={`member-row-${member.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} alt={member.firstName} />
                        <AvatarFallback className="bg-[#0066CC]/10 text-[#0066CC] text-xs font-semibold">
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-[#333333]">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-[#666666]">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#666666]">{member.station}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs font-medium text-[#0066CC] border-[#0066CC]/30 bg-[#0066CC]/5">
                      {member.generation}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-[#666666]">{member.roleLabel?.label || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        member.status === 'active'
                          ? 'bg-[#00AA55]/10 text-[#00AA55] border-[#00AA55]/20'
                          : 'bg-gray-100 text-[#666666] border-gray-200'
                      }`}
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => canView && navigate(`/members/${member.id}`)} disabled={!canView} className={`text-[#0066CC] hover:text-[#0055AA] hover:bg-[#0066CC]/5 ${ !canView ? "opacity-50 cursor-not-allowed" : "" }`}
                     data-testid={`view-member-${member.id}`}>
                    <Eye className="h-4 w-4 mr-1" /> Voir
                  </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-200 bg-[#F5F5F5]">
          <p className="text-xs text-[#666666]">Showing {filteredMembers.length} of {mockMembers.length} membres</p>
        </div>
      </div>
    </div>
  );
}