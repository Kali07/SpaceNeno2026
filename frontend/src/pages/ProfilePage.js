import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';

import {
  updateProfile,
  updatePassword
} from "@/api/userApi";

import {
  Button
} from '@/components/ui/button';

import {
  Input
} from '@/components/ui/input';

import {
  Label
} from '@/components/ui/label';

import {
  Card,
  CardContent
} from '@/components/ui/card';

import {
  Avatar,
  AvatarFallback
} from '@/components/ui/avatar';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

import {
  Camera,
  User,
  Lock,
  Bell,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Sparkles,
  MapPin,
  Shield,
  Layers
} from 'lucide-react';

export default function ProfilePage() {

  const { user } = useAuth();

  const [profile, setProfile] = useState({

    name: user?.name || '',

    email: user?.email || '',

    phone: user?.phone || '',

    bio: 'Administrateur de la plateforme NENO SPACE.',

    role: user?.role?.label || '',

    station: user?.station?.name || '',

    generation: user?.generation?.label || ''

  });

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2) || 'AD';

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const update = (key, value) =>

    setProfile({
      ...profile,
      [key]: value
    });

  // 🔹 SAVE PROFILE
  const handleSaveProfile = async () => {

    try {

      const res = await updateProfile({

        name: profile.name,

        email: profile.email,

        phone: profile.phone

      });

      localStorage.setItem(
        "neno_user",
        JSON.stringify(res)
      );

      window.location.reload();

    } catch (err) {

      console.error(err);
    }
  };

  // 🔹 CHANGE PASSWORD
  const handleChangePassword = async () => {

    if (newPassword !== confirmPassword) {

      alert(
        "Les mots de passe ne correspondent pas"
      );

      return;
    }

    try {

      await updatePassword({

        current_password: currentPassword,

        new_password: newPassword

      });

      alert("Mot de passe mis à jour");

      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");

    } catch (err) {

      console.error(err);
    }
  };

  return (

    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#00A2FF] p-8 shadow-2xl">

        {/* BG EFFECT */}
        <div className="absolute top-0 right-0 opacity-10">

          <ShieldCheck className="w-72 h-72 text-white" />

        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* LEFT */}
          <div className="flex items-center gap-6">

            {/* AVATAR */}
            <div className="relative group">

              <Avatar className="h-28 w-28 border-4 border-white/20 shadow-xl">

                <AvatarFallback className="bg-white/15 text-white text-4xl font-bold">

                  {initials}

                </AvatarFallback>

              </Avatar>

              <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">

                <Camera className="text-white h-7 w-7" />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                />

              </label>

            </div>

            {/* USER INFO */}
            <div>

              <div className="flex items-center gap-2">

                <Sparkles className="h-5 w-5 text-yellow-300" />

                <span className="text-blue-100 text-sm">

                  Mon Profil

                </span>

              </div>

              <h1 className="text-4xl font-bold text-white mt-1">

                {user?.name}

              </h1>

              <p className="text-blue-100 text-lg mt-1">

                {user?.role?.label}

              </p>

              <div className="flex flex-wrap gap-3 mt-5">

                <div className="bg-white/15 backdrop-blur px-4 py-2 rounded-2xl text-white text-sm flex items-center gap-2">

                  <Mail className="h-4 w-4" />

                  {user?.email}

                </div>

                <div className="bg-green-500/20 text-white px-4 py-2 rounded-2xl text-sm flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 mr-1" />

                  Compte actif

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* PROFILE CARD */}
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">

            <CardContent className="p-6">

              <div className="flex flex-col items-center text-center">

                <Avatar className="h-24 w-24 border-4 border-[#0066CC]/10">

                  <AvatarFallback className="bg-[#0066CC]/10 text-[#0066CC] text-3xl font-bold">

                    {initials}

                  </AvatarFallback>

                </Avatar>

                <h2 className="mt-4 text-2xl font-bold text-[#111]">

                  {user?.name}

                </h2>

                <p className="text-gray-500">

                  {user?.role?.label}

                </p>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3 w-full mt-6">

                  <div className="bg-[#0066CC]/5 rounded-2xl p-4">

                    <p className="text-sm text-gray-500">

                      Niveau

                    </p>

                    <p className="text-xl font-bold text-[#0066CC]">

                      {profile.role}

                    </p>

                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">

                    <p className="text-sm text-gray-500">

                      Statut

                    </p>

                    <p className="text-xl font-bold text-green-600">

                      Actif

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

          {/* QUICK INFO */}
          <Card className="border-0 shadow-lg rounded-3xl">

            <CardContent className="p-6 space-y-5">

              <h3 className="font-bold text-lg text-[#111]">

                Informations rapides

              </h3>

              <div className="space-y-4">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                    <Mail className="h-5 w-5 text-[#0066CC]" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">

                      Email

                    </p>

                    <p className="font-medium text-[#111]">

                      {profile.email}

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

                    <p className="font-medium text-[#111]">

                      {user?.phone}

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">

                    <MapPin className="h-5 w-5 text-orange-500" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">

                      Station

                    </p>

                    <p className="font-medium text-[#111]">

                      {user?.station?.name}

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

        {/* RIGHT SIDE */}
        <div className="xl:col-span-3">

          <Tabs
            defaultValue="general"
            className="space-y-6"
          >

            {/* TABS */}
            <TabsList className="bg-white border shadow-sm rounded-2xl p-1 h-auto">

              <TabsTrigger
                value="general"
                className="rounded-xl px-5 py-3 data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
              >

                <User className="h-4 w-4 mr-2" />

                Général

              </TabsTrigger>

              <TabsTrigger
                value="security"
                className="rounded-xl px-5 py-3 data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
              >

                <Lock className="h-4 w-4 mr-2" />

                Sécurité

              </TabsTrigger>

              <TabsTrigger
                value="notifications"
                className="rounded-xl px-5 py-3 data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
              >

                <Bell className="h-4 w-4 mr-2" />

                Notifications

              </TabsTrigger>

            </TabsList>

            {/* GENERAL */}
            <TabsContent value="general">

              <Card className="border-0 shadow-lg rounded-3xl">

                <CardContent className="p-8 space-y-8">

                  <div>

                    <h2 className="text-2xl font-bold text-[#111]">

                      Informations générales

                    </h2>

                    <p className="text-gray-500 mt-1">

                      Modifiez vos informations personnelles

                    </p>

                  </div>

                  {/* FORM GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* NAME */}
                    <div className="space-y-2">

                      <Label>
                        Nom complet
                      </Label>

                      <Input
                        value={profile.name}
                        onChange={(e) =>
                          update(
                            'name',
                            e.target.value
                          )
                        }
                        className="h-12 rounded-2xl border-gray-200"
                      />

                    </div>

                    {/* EMAIL */}
                    <div className="space-y-2">

                      <Label>
                        Email
                      </Label>

                      <Input
                        value={profile.email}
                        onChange={(e) =>
                          update(
                            'email',
                            e.target.value
                          )
                        }
                        className="h-12 rounded-2xl border-gray-200"
                      />

                    </div>

                    {/* PHONE */}
                    <div className="space-y-2">

                      <Label>
                        Téléphone
                      </Label>

                      <Input
                        value={profile.phone}
                        onChange={(e) =>
                          update(
                            'phone',
                            e.target.value
                          )
                        }
                        className="h-12 rounded-2xl border-gray-200"
                      />

                    </div>

                    {/* ROLE */}
                    <div className="space-y-2">

                      <Label>
                        Rôle
                      </Label>

                      <div className="relative">

                        <Shield className="absolute left-4 top-4 h-4 w-4 text-gray-400" />

                        <Input
                          value={profile.role}
                          disabled
                          className="h-12 rounded-2xl bg-[#F5F7FA] border-gray-200 pl-11"
                        />

                      </div>

                    </div>

                    {/* STATION */}
                    <div className="space-y-2">

                      <Label>
                        Station
                      </Label>

                      <div className="relative">

                        <MapPin className="absolute left-4 top-4 h-4 w-4 text-gray-400" />

                        <Input
                          value={profile.station}
                          disabled
                          className="h-12 rounded-2xl bg-[#F5F7FA] border-gray-200 pl-11"
                        />

                      </div>

                    </div>

                    {/* GENERATION */}
                    <div className="space-y-2">

                      <Label>
                        Génération
                      </Label>

                      <div className="relative">

                        <Layers className="absolute left-4 top-4 h-4 w-4 text-gray-400" />

                        <Input
                          value={profile.generation}
                          disabled
                          className="h-12 rounded-2xl bg-[#F5F7FA] border-gray-200 pl-11"
                        />

                      </div>

                    </div>

                  </div>

                  {/* BIO */}
                  <div className="space-y-2">

                    <Label>
                      Bio
                    </Label>

                    <textarea
                      rows={5}
                      value={profile.bio}
                      onChange={(e) =>
                        update(
                          'bio',
                          e.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />

                  </div>

                  {/* SAVE */}
                  <div className="flex justify-end">

                    <Button
                      onClick={handleSaveProfile}
                      className="h-12 px-6 rounded-2xl bg-[#0066CC] hover:bg-[#0055AA] shadow-lg"
                    >

                      <Save className="h-4 w-4 mr-2" />

                      Enregistrer les modifications

                    </Button>

                  </div>

                </CardContent>

              </Card>

            </TabsContent>

            {/* SECURITY */}
            <TabsContent value="security">

              <Card className="border-0 shadow-lg rounded-3xl">

                <CardContent className="p-8 space-y-8">

                  <div className="flex items-center gap-3">

                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">

                      <KeyRound className="text-red-500 h-6 w-6" />

                    </div>

                    <div>

                      <h2 className="text-2xl font-bold text-[#111]">

                        Sécurité du compte

                      </h2>

                      <p className="text-gray-500">

                        Modifiez votre mot de passe

                      </p>

                    </div>

                  </div>

                  <div className="space-y-5">

                    <div className="space-y-2">

                      <Label>
                        Mot de passe actuel
                      </Label>

                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(
                            e.target.value
                          )
                        }
                        className="h-12 rounded-2xl"
                      />

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="space-y-2">

                        <Label>
                          Nouveau mot de passe
                        </Label>

                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(
                              e.target.value
                            )
                          }
                          className="h-12 rounded-2xl"
                        />

                      </div>

                      <div className="space-y-2">

                        <Label>
                          Confirmation
                        </Label>

                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(
                              e.target.value
                            )
                          }
                          className="h-12 rounded-2xl"
                        />

                      </div>

                    </div>

                  </div>

                  <div className="flex justify-end">

                    <Button
                      onClick={handleChangePassword}
                      className="h-12 px-6 rounded-2xl bg-red-500 hover:bg-red-600 shadow-lg"
                    >

                      <Lock className="h-4 w-4 mr-2" />

                      Changer le mot de passe

                    </Button>

                  </div>

                </CardContent>

              </Card>

            </TabsContent>

            {/* NOTIFICATIONS */}
            <TabsContent value="notifications">

              <Card className="border-0 shadow-lg rounded-3xl">

                <CardContent className="p-8">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center">

                      <Bell className="h-6 w-6 text-yellow-500" />

                    </div>

                    <div>

                      <h2 className="text-2xl font-bold text-[#111]">

                        Notifications

                      </h2>

                      <p className="text-gray-500 mt-1">

                        Configurez vos préférences de notification

                      </p>

                    </div>

                  </div>

                  <div className="mt-8 bg-[#F5F7FA] rounded-3xl p-10 text-center">

                    <Bell className="mx-auto h-14 w-14 text-gray-300" />

                    <h3 className="mt-4 text-xl font-semibold text-[#111]">

                      Notifications bientôt disponibles

                    </h3>

                    <p className="text-gray-500 mt-2">

                      Les paramètres de notification seront activés prochainement.

                    </p>

                  </div>

                </CardContent>

              </Card>

            </TabsContent>

          </Tabs>

        </div>

      </div>

    </div>
  );
}