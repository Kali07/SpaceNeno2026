import { useEffect, useState } from "react";

import {
  Users,
  Shield,
  Activity,
  BellRing,
  Building2,
  Globe,
  TrendingUp,
  Layers3,
  Sparkles,
  Clock3,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import { getDashboard } from "../api/dashboardApi";

export default function DashboardPage() {

  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(true);

  // FETCH DASHBOARD
  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const data = await getDashboard();

      console.log("Dashboard :", data);

      setStats(data);

    } catch (err) {

      console.error("Erreur dashboard :", err);

    } finally {

      setLoading(false);

    }

  };

  // STATS CARDS
  const statCards = [

    {
      title: "Utilisateurs",
      value: stats.users || 0,
      icon: Users,
      color:
        "from-blue-500 to-cyan-500",
      bg:
        "bg-blue-50",
    },

    {
      title: "Administrateurs",
      value: stats.admins || 0,
      icon: Shield,
      color:
        "from-purple-500 to-fuchsia-500",
      bg:
        "bg-purple-50",
    },

    {
      title: "Utilisateurs actifs",
      value:
        stats.active_users || 0,
      icon: Activity,
      color:
        "from-green-500 to-emerald-500",
      bg:
        "bg-green-50",
    },

  ];

  return (

    <div className="space-y-8 p-2">

      {/* HERO */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[36px]
          bg-gradient-to-br
          from-slate-950
          via-blue-950
          to-cyan-800
          p-10
          text-white
          shadow-2xl
        "
      >

        {/* BG */}
        <div className="absolute inset-0">

          <div
            className="
              absolute
              top-0
              right-0
              w-96
              h-96
              bg-cyan-400/10
              rounded-full
              blur-3xl
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-0
              w-72
              h-72
              bg-blue-400/10
              rounded-full
              blur-3xl
            "
          />

        </div>

        {/* CONTENT */}
        <div className="relative z-10">

          <Badge
            className="
              mb-5
              bg-white/10
              text-white
              border-white/20
              backdrop-blur
              rounded-xl
            "
          >

            <Sparkles className="w-4 h-4 mr-2" />

            Vue générale de la plateforme

          </Badge>

          <h1
            className="
              text-4xl
              md:text-5xl
              font-bold
              tracking-tight
            "
          >
            Dashboard Général
          </h1>

          <p
            className="
              mt-4
              text-blue-100
              text-lg
              max-w-2xl
            "
          >
            Suivi global des performances,
            statistiques, activités et
            gestion de la plateforme.
          </p>

          {/* QUICK INFO */}
          <div className="mt-8 flex flex-wrap gap-4">

            <div
              className="
                bg-white/10
                backdrop-blur
                rounded-2xl
                px-5
                py-4
                min-w-[180px]
              "
            >

              <div className="flex items-center gap-2 text-blue-100 text-sm">

                <Clock3 className="w-4 h-4" />

                Dernière activité

              </div>

              <h2 className="text-2xl font-bold mt-2">
                Aujourd’hui
              </h2>

            </div>

            <div
              className="
                bg-white/10
                backdrop-blur
                rounded-2xl
                px-5
                py-4
                min-w-[180px]
              "
            >

              <div className="flex items-center gap-2 text-blue-100 text-sm">

                <TrendingUp className="w-4 h-4" />

                Croissance

              </div>

              <h2 className="text-2xl font-bold mt-2">
                +12%
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {statCards.map((stat, index) => (

          <Card
            key={index}
            className="
              border-0
              rounded-[30px]
              shadow-xl
              bg-white
              hover:shadow-2xl
              transition-all
              duration-300
              hover:-translate-y-1
            "
          >

            <CardContent className="p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2
                    className="
                      text-4xl
                      font-bold
                      mt-3
                      text-slate-900
                    "
                  >
                    {loading
                      ? "..."
                      : stat.value}
                  </h2>

                </div>

                <div
                  className={`
                    w-16
                    h-16
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    bg-gradient-to-r
                    ${stat.color}
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
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        {/* PERFORMANCE */}
        <Card
          className="
            rounded-[30px]
            border-0
            shadow-xl
          "
        >

          <CardContent className="p-7">

            <div className="flex items-center gap-3 mb-6">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                "
              >

                <TrendingUp
                  className="text-blue-600"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Performance
                </h2>

                <p className="text-sm text-gray-500">
                  Statistiques globales
                </p>

              </div>

            </div>

            <div className="space-y-5">

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm text-gray-600">
                    Activité système
                  </span>

                  <span className="font-semibold">
                    86%
                  </span>

                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="
                      h-full
                      bg-blue-500
                      rounded-full
                    "
                    style={{
                      width: "86%"
                    }}
                  />

                </div>

              </div>

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm text-gray-600">
                    Utilisateurs actifs
                  </span>

                  <span className="font-semibold">
                    72%
                  </span>

                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="
                      h-full
                      bg-green-500
                      rounded-full
                    "
                    style={{
                      width: "72%"
                    }}
                  />

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* INFRA */}
        <Card
          className="
            rounded-[30px]
            border-0
            shadow-xl
          "
        >

          <CardContent className="p-7">

            <div className="flex items-center gap-3 mb-6">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-cyan-100
                  flex
                  items-center
                  justify-center
                "
              >

                <Building2
                  className="text-cyan-600"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Infrastructure
                </h2>

                <p className="text-sm text-gray-500">
                  Répartition globale
                </p>

              </div>

            </div>

            <div className="space-y-4">

              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  bg-slate-50
                  p-4
                "
              >

                <div className="flex items-center gap-3">

                  <Layers3
                    className="
                      text-blue-500
                    "
                  />

                  <span>
                    Générations
                  </span>

                </div>

                <Badge>
                  {stats.generations || 0}
                </Badge>

              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  bg-slate-50
                  p-4
                "
              >

                <div className="flex items-center gap-3">

                  <Globe
                    className="
                      text-cyan-500
                    "
                  />

                  <span>
                    Stations
                  </span>

                </div>

                <Badge>
                  {stats.stations || 0}
                </Badge>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ACTIVITES */}
        <Card
          className="
            rounded-[30px]
            border-0
            shadow-xl
          "
        >

          <CardContent className="p-7">

            <div className="flex items-center gap-3 mb-6">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-orange-100
                  flex
                  items-center
                  justify-center
                "
              >

                <BellRing
                  className="
                    text-orange-600
                  "
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Activités
                </h2>

                <p className="text-sm text-gray-500">
                  Notifications système
                </p>

              </div>

            </div>

            <div className="space-y-4">

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  p-4
                "
              >

                <p className="font-medium">
                  Nouvelle génération créée
                </p>

                <span
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  Il y a 2 heures
                </span>

              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  p-4
                "
              >

                <p className="font-medium">
                  Synchronisation terminée
                </p>

                <span
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  Aujourd’hui
                </span>

              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  p-4
                "
              >

                <p className="font-medium">
                  Système opérationnel
                </p>

                <span
                  className="
                    text-sm
                    text-green-600
                  "
                >
                  Aucun incident détecté
                </span>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  );

}