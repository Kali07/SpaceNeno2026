import { useState, useEffect } from 'react';

import { useParams, useNavigate} from 'react-router-dom';

import {Button} from '@/components/ui/button';

import {Input} from '@/components/ui/input';

import { Label} from '@/components/ui/label';

import {Badge} from '@/components/ui/badge';

import {Card,CardContent} from '@/components/ui/card';

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { ArrowLeft, Save, Upload, Mail, Phone, MapPin, Calendar, Shield, User, Crown, Users, Sparkles, Trash2, Pencil, CheckCircle2} from 'lucide-react';

import {
  getUsers,
  updateUser,
  deleteUser
} from "../api/userApi";

import {
  getStations
} from "../api/stationApi";

import {
  getRoles
} from "../api/roleApi";

import {
  getGenerations
} from "../api/generationApi";

import {
  useMessage
} from "../context/MessageContext";

export default function MemberDetailPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { showMessage } = useMessage();

  const [member, setMember] = useState(null);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({});

  const [initialForm, setInitialForm] = useState({});

  const [stations, setStations] = useState([]);

  const [roles, setRoles] = useState([]);

  const [generations, setGenerations] = useState([]);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const [
          users,
          stationsData,
          rolesData,
          generationsData
        ] = await Promise.all([
          getUsers(),
          getStations(),
          getRoles(),
          getGenerations()
        ]);

        setStations(stationsData);

        setRoles(rolesData);

        setGenerations(generationsData);

        const found = users.find(
          u => u.id == id
        );

        if (found) {

          const parts =
            found.name.split(" ");

          const formatted = {

            id: found.id,

            firstName:
              parts[0] || "",

            lastName:
              parts.slice(1).join(" ") || "",

            email:
              found.email,

            phone:
              found.phone || "",

            sexe:
              found.sexe || "N/A",

            role:
              String(found.role?.id || ""),

            generation:
              String(found.generation?.id || ""),

            station:
              String(found.station?.id || ""),

            status:
              "active",

            avatar:
              found.avatar || null
          };

          setMember(formatted);

          setForm(formatted);

          setInitialForm(formatted);
        }

      } catch (error) {

        console.error(error);

      }
    };

    fetchUser();

  }, [id]);

  if (!member) {

    return (

      <div className="flex items-center justify-center h-[70vh]">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-gray-700">
            Membre introuvable
          </h2>

          <Button
            className="mt-4"
            onClick={() =>
              navigate('/members')
            }
          >

            <ArrowLeft className="h-4 w-4 mr-2" />

            Retour

          </Button>

        </div>

      </div>
    );
  }

  const update = (key, value) => {

    setForm({
      ...form,
      [key]: value
    });
  };

  const handleCancel = () => {

    setForm(initialForm);

    setEditing(false);
  };

  const handleDelete = async () => {

    if (
      !window.confirm(
        "Supprimer ce membre ?"
      )
    ) return;

    try {

      await deleteUser(member.id);

      showMessage(
        "Membre supprimé avec succès"
      );

      navigate('/members');

    } catch (error) {

      showMessage(
        "Erreur suppression",
        "error"
      );
    }
  };

  const handleSave = async () => {

    try {

      const fullName =
        `${form.firstName} ${form.lastName}`;

      await updateUser(form.id, {

        name: fullName,

        email: form.email,

        phone: form.phone,

        role_id: form.role,

        generation_id: form.generation,

        station_id: form.station
      });

      showMessage(
        "Profil mis à jour"
      );

      setEditing(false);

    } catch (error) {

      showMessage(
        "Erreur modification",
        "error"
      );
    }
  };

  const currentRole =
    roles.find(
      r => String(r.id) === form.role
    );

  const currentGeneration =
    generations.find(
      g => String(g.id) === form.generation
    );

  const currentStation =
    stations.find(
      s => String(s.id) === form.station
    );

  return (

    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#00AAFF] p-8 shadow-2xl">

        <div className="absolute top-0 right-0 opacity-10">

          <Users className="w-80 h-80 text-white" />

        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* LEFT */}
          <div className="flex items-center gap-6">

            <div className="relative group">

              <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">

                <AvatarImage
                  src={member.avatar}
                  alt={member.firstName}
                />

                <AvatarFallback className="bg-white text-[#0066CC] text-4xl font-bold">

                  {member.firstName[0]}
                  {member.lastName[0]}

                </AvatarFallback>

              </Avatar>

              {editing && (

                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all">

                  <Upload className="h-7 w-7 text-white" />

                  <input
                    type="file"
                    className="hidden"
                  />

                </label>
              )}

            </div>

            <div>

              <div className="flex items-center gap-3 mb-3">

                <Badge className="bg-white/20 text-white border-white/20 backdrop-blur">

                  <Sparkles className="h-3 w-3 mr-1" />

                  Profil membre

                </Badge>

                <Badge className="bg-green-500/20 text-white border-green-300/20">

                  <CheckCircle2 className="h-3 w-3 mr-1" />

                  Actif

                </Badge>

              </div>

              <h1 className="text-4xl font-bold text-white">

                {member.firstName}
                {" "}
                {member.lastName}

              </h1>

              <p className="text-blue-100 mt-2 text-lg">

                {currentRole?.label}

              </p>

              <div className="flex flex-wrap gap-3 mt-5">

                <div className="bg-white/15 backdrop-blur px-4 py-2 rounded-2xl text-white text-sm">

                  {currentGeneration?.label}

                </div>

                <div className="bg-white/15 backdrop-blur px-4 py-2 rounded-2xl text-white text-sm">

                  {currentStation?.name}

                </div>

              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3">

            <Button
              variant="secondary"
              className="rounded-2xl"
              onClick={() =>
                navigate('/members')
              }
            >

              <ArrowLeft className="h-4 w-4 mr-2" />

              Retour

            </Button>

            {editing ? (

              <>

                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 rounded-2xl"
                >

                  <Save className="h-4 w-4 mr-2" />

                  Enregistrer

                </Button>

                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={handleCancel}
                >

                  Annuler

                </Button>

              </>

            ) : (

              <>

                <Button
                  onClick={() =>
                    setEditing(true)
                  }
                  className="bg-white text-[#0066CC] hover:bg-gray-100 rounded-2xl"
                >

                  <Pencil className="h-4 w-4 mr-2" />

                  Modifier

                </Button>

                <Button
                  variant="destructive"
                  className="rounded-2xl"
                  onClick={handleDelete}
                >

                  <Trash2 className="h-4 w-4 mr-2" />

                  Supprimer

                </Button>

              </>

            )}

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="space-y-6">

          {/* CONTACT */}
          <Card className="rounded-3xl border-0 shadow-xl">

            <CardContent className="p-6">

              <h2 className="text-xl font-bold mb-6 text-[#111]">

                Informations

              </h2>

              <div className="space-y-5">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                    <Mail className="h-5 w-5 text-blue-600" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="font-semibold text-[#111]">
                      {member.email}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">

                    <Phone className="h-5 w-5 text-green-600" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Téléphone
                    </p>

                    <p className="font-semibold text-[#111]">
                      {member.phone || "N/A"}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">

                    <MapPin className="h-5 w-5 text-orange-600" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Station
                    </p>

                    <p className="font-semibold text-[#111]">
                      {currentStation?.name}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">

                    <Calendar className="h-5 w-5 text-purple-600" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Sexe
                    </p>

                    <p className="font-semibold text-[#111]">
                      {member.sexe}
                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

        {/* RIGHT */}
        <div className="xl:col-span-2 space-y-6">

          {/* PERSONAL */}
          <Card className="rounded-3xl border-0 shadow-xl">

            <CardContent className="p-8">

              <div className="flex items-center gap-3 mb-8">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">

                  <User className="h-7 w-7 text-[#0066CC]" />

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-[#111]">

                    Informations personnelles

                  </h2>

                  <p className="text-gray-500">
                    Modifier les informations du membre
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">

                  <Label>
                    Prénom
                  </Label>

                  <Input
                    value={form.firstName}
                    onChange={(e) =>
                      update(
                        'firstName',
                        e.target.value
                      )
                    }
                    disabled={!editing}
                    className="h-12 rounded-2xl"
                  />

                </div>

                <div className="space-y-2">

                  <Label>
                    Nom
                  </Label>

                  <Input
                    value={form.lastName}
                    onChange={(e) =>
                      update(
                        'lastName',
                        e.target.value
                      )
                    }
                    disabled={!editing}
                    className="h-12 rounded-2xl"
                  />

                </div>

                <div className="space-y-2">

                  <Label>
                    Email
                  </Label>

                  <Input
                    value={form.email}
                    onChange={(e) =>
                      update(
                        'email',
                        e.target.value
                      )
                    }
                    disabled={!editing}
                    className="h-12 rounded-2xl"
                  />

                </div>

                <div className="space-y-2">

                  <Label>
                    Téléphone
                  </Label>

                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      update(
                        'phone',
                        e.target.value
                      )
                    }
                    disabled={!editing}
                    className="h-12 rounded-2xl"
                  />

                </div>

              </div>

            </CardContent>

          </Card>

          {/* COMMUNITY */}
          <Card className="rounded-3xl border-0 shadow-xl">

            <CardContent className="p-8">

              <div className="flex items-center gap-3 mb-8">

                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">

                  <Shield className="h-7 w-7 text-purple-600" />

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-[#111]">

                    Informations communautaires

                  </h2>

                  <p className="text-gray-500">
                    Gestion des accès et affiliations
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* STATION */}
                <div className="space-y-2">

                  <Label>
                    Station
                  </Label>

                  {editing ? (

                    <Select
                      value={form.station}
                      onValueChange={(v) =>
                        update(
                          "station",
                          v
                        )
                      }
                    >

                      <SelectTrigger className="h-12 rounded-2xl">

                        <SelectValue />

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

                  ) : (

                    <Input
                      value={currentStation?.name || ""}
                      disabled
                      className="h-12 rounded-2xl"
                    />

                  )}

                </div>

                {/* ROLE */}
                <div className="space-y-2">

                  <Label>
                    Rôle
                  </Label>

                  {editing ? (

                    <Select
                      value={form.role}
                      onValueChange={(v) =>
                        update(
                          "role",
                          v
                        )
                      }
                    >

                      <SelectTrigger className="h-12 rounded-2xl">

                        <SelectValue />

                      </SelectTrigger>

                      <SelectContent>

                        {roles.map((r) => (

                          <SelectItem
                            key={r.id}
                            value={String(r.id)}
                          >

                            {r.label}

                          </SelectItem>

                        ))}

                      </SelectContent>

                    </Select>

                  ) : (

                    <Input
                      value={currentRole?.label || ""}
                      disabled
                      className="h-12 rounded-2xl"
                    />

                  )}

                </div>

                {/* GENERATION */}
                <div className="space-y-2">

                  <Label>
                    Génération
                  </Label>

                  {editing ? (

                    <Select
                      value={form.generation}
                      onValueChange={(v) =>
                        update(
                          "generation",
                          v
                        )
                      }
                    >

                      <SelectTrigger className="h-12 rounded-2xl">

                        <SelectValue />

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

                  ) : (

                    <Input
                      value={currentGeneration?.label || ""}
                      disabled
                      className="h-12 rounded-2xl"
                    />

                  )}

                </div>

                {/* SEXE */}
                <div className="space-y-2">

                  <Label>
                    Sexe
                  </Label>

                  <Input
                    value={form.sexe}
                    disabled
                    className="h-12 rounded-2xl"
                  />

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
}