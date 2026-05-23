import { useEffect, useState } from "react";

import {
  Users,
  Shield,
  Activity,
  BellRing,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getDashboard } from "../api/dashboardApi";
import { getUsers } from "../api/userApi";

const roleColors = {
  admin_technique:
    "bg-blue-50 text-blue-600 border-blue-200",

  admin_fonctionnel:
    "bg-purple-50 text-purple-600 border-purple-200",

  admin_national:
    "bg-green-50 text-green-600 border-green-200",

  admin_provincial:
    "bg-orange-50 text-orange-600 border-orange-200",

  gestionnaire:
    "bg-cyan-50 text-cyan-600 border-cyan-200",
};

export default function DashboardPage() {

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  // FETCH
  useEffect(() => {
    fetchDashboard();
    fetchUsers();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // STATS
  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.users || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },

    {
      title: "Actifs",
      value: stats.active_users || 0,
      icon: Activity,
      color: "from-green-500 to-emerald-500",
    },

    {
      title: "Demandes",
      value: stats.pending_requests || 0,
      icon: BellRing,
      color: "from-orange-500 to-amber-500",
    },

    {
      title: "Administrateurs",
      value: stats.admins || 0,
      icon: Shield,
      color: "from-purple-500 to-fuchsia-500",
    },
  ];

  return (
    <div className="space-y-8 p-2">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-10 text-white shadow-2xl">

        <div className="absolute top-0 right-0 opacity-10">
          <Activity size={220} />
        </div>

        <div className="relative z-10">

          <h1 className="text-4xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-3 text-blue-100 text-lg">
            Vue globale et performances de la plateforme
          </p>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {statCards.map((stat, index) => (

          <Card
            key={index}
            className="
              border-0
              shadow-xl
              rounded-[28px]
              bg-white/80
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-2xl
            "
          >

            <CardContent className="p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {stat.value}
                  </h2>

                </div>

                <div
                  className={`
                    w-16 h-16 rounded-2xl
                    bg-gradient-to-r ${stat.color}
                    flex items-center justify-center
                    shadow-lg
                  `}
                >
                  <stat.icon
                    className="text-white"
                    size={28}
                  />
                </div>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* STATISTIQUES RAPIDES */}
        <Card
          className="
            rounded-[28px]
            shadow-xl
            border-0
            transition-all
            duration-300
            hover:shadow-2xl
          "
        >

          <CardContent className="p-7">

            <h2 className="text-2xl font-bold mb-6">
              Statistiques rapides
            </h2>

            <div className="space-y-5">

              {/* ACTIFS */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">

                <div>

                  <p className="text-sm text-gray-500">
                    Utilisateurs actifs
                  </p>

                  <h3 className="text-3xl font-bold mt-1">
                    {stats.active_users || 0}
                  </h3>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

                  <Activity className="text-green-600" />

                </div>

              </div>

              {/* NOUVEAUX */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">

                <div>

                  <p className="text-sm text-gray-500">
                    Nouveaux aujourd’hui
                  </p>

                  <h3 className="text-3xl font-bold mt-1">
                    {stats.new_users || 0}
                  </h3>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <Users className="text-blue-600" />

                </div>

              </div>

              {/* DEMANDES */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">

                <div>

                  <p className="text-sm text-gray-500">
                    Demandes en attente
                  </p>

                  <h3 className="text-3xl font-bold mt-1">
                    {stats.pending_requests || 0}
                  </h3>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                  <BellRing className="text-orange-600" />

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* REPARTITION DES ROLES */}
        <Card
          className="
            rounded-[28px]
            shadow-xl
            border-0
            transition-all
            duration-300
            hover:shadow-2xl
          "
        >

          <CardContent className="p-7">

            <h2 className="text-2xl font-bold mb-6">
              Répartition des rôles
            </h2>

            <div className="space-y-6">

              {/* ADMIN TECH */}
              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-medium">
                    Admin Technique
                  </span>

                  <span className="font-bold">
                    {stats.admins_technique || 0}
                  </span>

                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: "70%" }}
                  />

                </div>

              </div>

              {/* ADMIN NATIONAL */}
              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-medium">
                    Admin National
                  </span>

                  <span className="font-bold">
                    {stats.admins_national || 0}
                  </span>

                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: "55%" }}
                  />

                </div>

              </div>

              {/* GESTIONNAIRES */}
              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-medium">
                    Gestionnaires
                  </span>

                  <span className="font-bold">
                    {stats.gestionnaires || 0}
                  </span>

                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: "40%" }}
                  />

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* USERS TABLE */}
      <Card
        className="
          rounded-[32px]
          border-0
          shadow-2xl
          overflow-hidden
        "
      >

        <div className="p-7 border-b bg-slate-50">

          <h2 className="text-2xl font-bold">
            Utilisateurs récents
          </h2>

          <p className="text-gray-500 mt-1">
            Liste des derniers utilisateurs enregistrés
          </p>

        </div>

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Utilisateur
              </TableHead>

              <TableHead>
                Rôle
              </TableHead>

              <TableHead>
                Station
              </TableHead>

              <TableHead>
                Date création
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {users.map((user) => (

              <TableRow
                key={user.id}
                className="hover:bg-slate-50 transition-colors"
              >

                {/* USER */}
                <TableCell>

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-11 h-11
                        rounded-full
                        bg-blue-100
                        flex items-center justify-center
                        font-bold
                        text-blue-600
                      "
                    >
                      {user.name?.charAt(0)}
                    </div>

                    <div>

                      <p className="font-semibold">
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
                    className={roleColors[user.role?.label]}
                  >
                    {user.role?.label}
                  </Badge>

                </TableCell>

                {/* STATION */}
                <TableCell>

                  <Badge variant="outline">
                    {user.station?.name || "-"}
                  </Badge>

                </TableCell>

                {/* DATE */}
                <TableCell className="text-gray-500">

                  {user.created_at
                    ? new Date(
                        user.created_at
                      ).toLocaleDateString()
                    : "-"}

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Card>

    </div>
  );
}