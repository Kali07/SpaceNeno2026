import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent
} from '@/components/ui/card';

import {
  Badge
} from '@/components/ui/badge';

import {
  Button
} from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Shield,
  Users,
  UserCog,
  Settings,
  MoreHorizontal,
  Trash2,
  KeyRound,
  MapPinned,
  Globe2,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  Crown,
  UserCheck,
  Map,
  Layers3,
  Activity,
  BellRing,
  ChevronRight
} from 'lucide-react';

import { mockAdminUsers } from '@/data/mockData';

const roleColors = {

  super_admin:
    'bg-red-50 text-red-600 border-red-200',

  admin_technique:
    'bg-blue-50 text-blue-600 border-blue-200',

  admin_fonctionnel:
    'bg-purple-50 text-purple-600 border-purple-200',

  admin_national:
    'bg-green-50 text-green-600 border-green-200',

  admin_provincial:
    'bg-orange-50 text-orange-600 border-orange-200',

  gestionnaire:
    'bg-cyan-50 text-cyan-600 border-cyan-200'
};

export default function AdministrationPage() {

  const navigate = useNavigate();

  // STATS
  const totalUsers =
    mockAdminUsers.length;

  const activeUsers =
    mockAdminUsers.filter(
      u => u.status === 'active'
    ).length;

  const adminsTechnique =
    mockAdminUsers.filter(
      u => u.role?.label === 'admin_technique'
    ).length;

  const adminsNational =
    mockAdminUsers.filter(
      u => u.role?.label === 'admin_national'
    ).length;

  const adminsProvincial =
    mockAdminUsers.filter(
      u => u.role?.label === 'admin_provincial'
    ).length;

  const gestionnaires =
    mockAdminUsers.filter(
      u => u.role?.label === 'gestionnaire'
    ).length;

  const quickActions = [

    {
      title: 'Continents',
      icon: Globe2,
      color: 'from-blue-500 to-blue-700',
      route: '/continents',
      desc: 'Gestion des continents'
    },

    {
      title: 'Pays',
      icon: MapPinned,
      color: 'from-green-500 to-green-700',
      route: '/pays',
      desc: 'Gestion des pays'
    },

    {
      title: 'Villes',
      icon: Building2,
      color: 'from-orange-500 to-orange-700',
      route: '/villes',
      desc: 'Gestion des villes'
    },

    {
      title: 'Approvals',
      icon: CheckCircle2,
      color: 'from-purple-500 to-purple-700',
      route: '/approvals',
      desc: 'Validation des demandes'
    }

  ];

  const statCards = [

    {
      title: 'Membres',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },

    {
      title: 'Actifs',
      value: activeUsers,
      icon: Activity,
      color: 'bg-green-500'
    },

    {
      title: 'Gestionnaires',
      value: gestionnaires,
      icon: UserCheck,
      color: 'bg-cyan-500'
    },

    {
      title: 'Admin Provinciaux',
      value: adminsProvincial,
      icon: Shield,
      color: 'bg-orange-500'
    },

    {
      title: 'Admin Nationaux',
      value: adminsNational,
      icon: Crown,
      color: 'bg-purple-500'
    },

    {
      title: 'Admin Techniques',
      value: adminsTechnique,
      icon: Settings,
      color: 'bg-red-500'
    }

  ];

  return (

    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#00AAFF] p-8 shadow-2xl">

        {/* BG */}
        <div className="absolute top-0 right-0 opacity-10">

          <Shield className="w-80 h-80 text-white" />

        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* LEFT */}
          <div>

            <div className="flex items-center gap-3 mb-4">

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">

                <Shield className="text-white h-7 w-7" />

              </div>

              <div>

                <p className="text-blue-100 text-sm">
                  Panneau d'administration
                </p>

                <h1 className="text-4xl font-bold text-white">
                  Administration
                </h1>

              </div>

            </div>

            <p className="text-blue-100 max-w-2xl leading-relaxed">

              Gérez les utilisateurs, les rôles,
              les permissions, les validations
              ainsi que toute la structure
              organisationnelle de votre plateforme.

            </p>

            <div className="flex flex-wrap gap-3 mt-6">

              <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-2 text-white text-sm">

                {totalUsers} utilisateurs

              </div>

              <div className="bg-green-500/20 rounded-2xl px-4 py-2 text-white text-sm">

                {activeUsers} actifs

              </div>

              <div className="bg-yellow-500/20 rounded-2xl px-4 py-2 text-white text-sm">

                Administration sécurisée

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white/10 backdrop-blur rounded-3xl p-5 border border-white/10">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-blue-100 text-sm">
                    Approvals
                  </p>

                  <h2 className="text-3xl font-bold text-white">
                    12
                  </h2>

                </div>

                <BellRing className="text-white h-8 w-8" />

              </div>

            </div>

            <div className="bg-white/10 backdrop-blur rounded-3xl p-5 border border-white/10">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-blue-100 text-sm">
                    Roles
                  </p>

                  <h2 className="text-3xl font-bold text-white">
                    6
                  </h2>

                </div>

                <Layers3 className="text-white h-8 w-8" />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {statCards.map((stat, index) => (

          <Card
            key={index}
            className="border-0 shadow-lg rounded-3xl hover:shadow-2xl transition-all duration-300"
          >

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="text-4xl font-bold text-[#111] mt-2">
                    {stat.value}
                  </h2>

                </div>

                <div className={`w-16 h-16 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg`}>

                  <stat.icon className="text-white h-8 w-8" />

                </div>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

      {/* QUICK ACTIONS */}
      <div>

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold text-[#111]">
              Gestion rapide
            </h2>

            <p className="text-gray-500 mt-1">
              Accédez rapidement aux modules administratifs
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {quickActions.map((action, index) => (

            <Card
              key={index}
              onClick={() =>
                navigate(action.route)
              }
              className="group cursor-pointer border-0 shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >

              <CardContent className="p-0">

                <div className={`bg-gradient-to-r ${action.color} p-6 relative overflow-hidden`}>

                  <div className="absolute top-0 right-0 opacity-10">

                    <action.icon className="w-32 h-32 text-white" />

                  </div>

                  <div className="relative z-10 flex items-center justify-between">

                    <div>

                      <h3 className="text-white text-xl font-bold">
                        {action.title}
                      </h3>

                      <p className="text-white/80 text-sm mt-1">
                        {action.desc}
                      </p>

                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">

                      <action.icon className="text-white h-7 w-7" />

                    </div>

                  </div>

                </div>

                <div className="p-5 flex items-center justify-between">

                  <span className="text-sm font-medium text-[#111]">

                    Ouvrir le module

                  </span>

                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

      {/* ADMINS TABLE */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">

        <div className="flex items-center justify-between p-6 border-b bg-white">

          <div>

            <h2 className="text-2xl font-bold text-[#111]">
              Administrateurs & Gestionnaires
            </h2>

            <p className="text-gray-500 mt-1">
              Gérez les accès et permissions
            </p>

          </div>

        </div>

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow className="bg-[#F8FAFC]">

                <TableHead>
                  Utilisateur
                </TableHead>

                <TableHead>
                  Rôle
                </TableHead>

                <TableHead>
                  Statut
                </TableHead>

                <TableHead>
                  Dernière connexion
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {mockAdminUsers.map((user) => (

                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50"
                >

                  {/* USER */}
                  <TableCell>

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-[#0066CC]/10 flex items-center justify-center">

                        <Users className="h-5 w-5 text-[#0066CC]" />

                      </div>

                      <div>

                        <p className="font-semibold text-[#111]">

                          {user.name}

                        </p>

                        <p className="text-sm text-gray-500">

                          {user.email}

                        </p>

                      </div>

                    </div>

                  </TableCell>

                  {/* ROLE */}
                  <TableCell>

                    <Badge
                      variant="outline"
                      className={`capitalize px-3 py-1 rounded-xl border ${
                        roleColors[
                          user.role?.label
                        ] ||
                        roleColors.gestionnaire
                      }`}
                    >

                      {user.role?.label}

                    </Badge>

                  </TableCell>

                  {/* STATUS */}
                  <TableCell>

                    <Badge
                      className={
                        user.status === 'active'
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }
                    >

                      {user.status}

                    </Badge>

                  </TableCell>

                  {/* LAST LOGIN */}
                  <TableCell className="text-gray-500">

                    <div className="flex items-center gap-2">

                      <Clock3 className="h-4 w-4" />

                      {
                        new Date(
                          user.lastLogin
                        ).toLocaleDateString()
                      }

                    </div>

                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">

                    <DropdownMenu>

                      <DropdownMenuTrigger asChild>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl"
                        >

                          <MoreHorizontal className="h-5 w-5" />

                        </Button>

                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">

                        <DropdownMenuItem>

                          <Eye className="mr-2 h-4 w-4" />

                          Voir profil

                        </DropdownMenuItem>

                        <DropdownMenuItem>

                          <UserCog className="mr-2 h-4 w-4" />

                          Modifier rôle

                        </DropdownMenuItem>

                        <DropdownMenuItem>

                          <KeyRound className="mr-2 h-4 w-4" />

                          Réinitialiser mot de passe

                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-red-600">

                          <Trash2 className="mr-2 h-4 w-4" />

                          Supprimer

                        </DropdownMenuItem>

                      </DropdownMenuContent>

                    </DropdownMenu>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>

      </Card>

    </div>
  );
}