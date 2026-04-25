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
import { getUsers, updateUser } from "../api/userApi";
import { useEffect } from "react";

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUsers();
  
      const found = data.find(u => u.id == id);
  
      if (found) {
        const parts = found.name.split(" ");
  
        const formatted = {
          id: found.id,
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
          email: found.email,
          phone: found.phone || "",
          role: found.role?.label || "membre",
          generation: "G1",
          station: "N/A",
          zone: "N/A",
          status: "active"
        };
  
        setMember(formatted);
        setForm(formatted);
      }
    };
  
    fetchUser();
  }, [id]);

  if (!member) {
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

  const handleSave = async () => {
    const fullName = `${form.firstName} ${form.lastName}`;
  
    await updateUser(form.id, {
      name: fullName,
      email: form.email,
      phone: form.phone
    });
  
    setEditing(false);
  };

  const update = (key, value) => setForm({ ...form, [key]: value });

  return (
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
          <Button onClick={() => setEditing(true)} className="bg-[#0066CC] hover:bg-[#0055AA] text-white" data-testid="edit-member-btn">
            Modifier le Profil
          </Button>
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
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Zone</Label>
                  <Input value={form.zone} disabled className="bg-[#F5F5F5]" data-testid="detail-zone" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Role</Label>
                  {editing ? (
                    <Select value={form.role} onValueChange={(v) => update('role', v)}>
                      <SelectTrigger data-testid="detail-role-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Member">Membre</SelectItem>
                        <SelectItem value="Assistant">Assistant</SelectItem>
                        <SelectItem value="Leader">Responsable</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={form.role} disabled className="bg-[#F5F5F5]" data-testid="detail-role" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Generation</Label>
                  {editing ? (
                    <Select value={form.generation} onValueChange={(v) => update('generation', v)}>
                      <SelectTrigger data-testid="detail-generation-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="G1">G1</SelectItem>
                        <SelectItem value="G2">G2</SelectItem>
                        <SelectItem value="G3">G3</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={form.generation} disabled className="bg-[#F5F5F5]" data-testid="detail-generation" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
