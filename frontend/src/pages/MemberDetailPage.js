import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Upload, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { getUsers, updateUser, deleteUser } from "../api/userApi";
import { useEffect } from "react";

export default function MemberDetailPage() {// composant pour afficher les détails d'un membre spécifique et permettre la modification de ses informations
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {// fonction pour récupérer les informations du membre à partir de son ID et les stocker dans l'état local
    const fetchUser = async () => {// envoie une requête au backend pour obtenir la liste des utilisateurs
      const data = await getUsers();
  
      const found = data.find(u => u.id == id);
  
      if (found) {// si un utilisateur correspondant à l'ID est trouvé, formate ses informations pour les afficher dans la page de détails du membre
        const parts = found.name.split(" ");
  
        const formatted = {// formate les informations de l'utilisateur trouvé pour les afficher dans la page de détails du membre
          id: found.id,
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
          email: found.email,
          phone: found.phone || "",
          role: found.role?.label || "membre",
          generation: "G1",
          station: "N/A",
          ville: "N/A",
          status: "active"
        };
  
        setMember(formatted);// stocke les informations formatées du membre dans l'état local pour les afficher dans la page de détails du membre
        setForm(formatted);// initialise le formulaire de modification avec les informations du membre trouvé
      }
    };
  
    fetchUser();// appelle la fonction pour récupérer les informations du membre lorsque le composant est monté ou lorsque l'ID change
  }, [id]);

  if (!member) {// si aucun membre n'est trouvé avec l'ID donné, affiche un message d'erreur et un bouton pour revenir à la liste des membres
    return (
      <div className="flex items-center justify-center h-64" data-testid="member-not-found">
        <div className="text-center">
          <p className="text-lg font-medium text-[#333333]">Membre non trouvé</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/members')} data-testid="back-to-members-btn">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux Membres
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {// fonction pour gérer la sauvegarde des modifications apportées aux informations du membre
    const fullName = `${form.firstName} ${form.lastName}`;
  
    await updateUser(form.id, {
      name: fullName,
      email: form.email,
      phone: form.phone
    });
  
    setEditing(false);// désactive le mode édition après la sauvegarde des modifications
  };

  const handleDelete = async (id) => {// fonction pour gérer la suppression du membre
    if (!confirm("Supprimer ce membre ?")) return;
  
    await deleteUser(member.id);// envoie une requête au backend pour supprimer le membre avec l'ID spécifié
  
    navigate('/members'); // après la suppression, redirige l'utilisateur vers la liste des membres
  };

  const update = (key, value) => setForm({ ...form, [key]: value });// fonction pour mettre à jour les valeurs du formulaire de modification des informations du membre

  return (// rendu du composant avec la structure de la page, les détails du membre et les options de modification et de suppression
    <div className="space-y-6" data-testid="member-detail-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/members')} data-testid="back-btn">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight font-heading text-[#333333]">Profil du Membre</h1>
          <p className="text-sm text-[#666666]">Voir et gérer les informations du membre</p>
        </div>
        {editing ? (
          <Button onClick={handleSave} className="bg-[#00AA55] hover:bg-[#009944] text-white" data-testid="save-member-btn">
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        ) : (
          <div className="flex gap-2">
          <Button
            onClick={() => setEditing(true)}
            className="bg-[#0066CC] hover:bg-[#0055AA] text-white"
          >
            Modifier le Profil
          </Button>
        
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Supprimer le Profil
          </Button>
        </div>

        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={member.avatar} alt={member.firstName} />
                  <AvatarFallback className="bg-[#0066CC]/10 text-[#0066CC] text-2xl font-bold">
                    {member.firstName[0]}{member.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" data-testid="upload-avatar-label">
                    <Upload className="h-6 w-6 text-white" />
                    <input type="file" accept="image/*" className="hidden" data-testid="upload-avatar-input" />
                  </label>
                )}
              </div>
              <h2 className="mt-4 text-lg font-bold font-heading text-[#333333]">{member.firstName} {member.lastName}</h2>
              <p className="text-sm text-[#666666]">{member.role}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className={member.status === 'active' ? 'bg-[#00AA55]/10 text-[#00AA55] border-[#00AA55]/20' : 'bg-gray-100 text-[#666666] border-gray-200'}>
                  {member.status}
                </Badge>
                <Badge variant="outline" className="text-[#0066CC] border-[#0066CC]/30 bg-[#0066CC]/5">{member.generation}</Badge>
              </div>

              <Separator className="my-5" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-[#666666]" />
                  <span className="text-[#333333]">{member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-[#666666]" />
                  <span className="text-[#333333]">{member.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-[#666666]" />
                  <span className="text-[#333333]">{member.station}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-[#666666]" />
                  <span className="text-[#333333]">Joined {new Date(member.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editable Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold font-heading text-[#333333] flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#0066CC]" /> Information Personnelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Prénom</Label>
                  <Input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} disabled={!editing} className={editing ? '' : 'bg-[#F5F5F5]'} data-testid="detail-firstname" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Nom</Label>
                  <Input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} disabled={!editing} className={editing ? '' : 'bg-[#F5F5F5]'} data-testid="detail-lastname" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Email</Label>
                  <Input value={form.email} onChange={(e) => update('email', e.target.value)} disabled={!editing} className={editing ? '' : 'bg-[#F5F5F5]'} data-testid="detail-email" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Téléphone</Label>
                  <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} disabled={!editing} className={editing ? '' : 'bg-[#F5F5F5]'} data-testid="detail-phone" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold font-heading text-[#333333] flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0066CC]" />  Communauté Affiliée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Station</Label>
                  <Input value={form.station} disabled className="bg-[#F5F5F5]" data-testid="detail-station" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Ville</Label>
                  <Input value={form.ville} disabled className="bg-[#F5F5F5]" data-testid="detail-ville" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Role</Label>
                  
                    <Input value={form.role?.label || ""} disabled className="bg-[#F5F5F5]" data-testid="detail-role" />
                  
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Generation</Label>
                 
                    <Input value={form.generation} disabled className="bg-[#F5F5F5]" data-testid="detail-generation" />
                
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
