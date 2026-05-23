import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar';

import {
  dashboardStats,
  mockMembers,
  mockTeachings
} from '@/data/mockData';

import {
  Users,
  MapPin,
  Map,
  BookOpen,
  TrendingUp,
  UserCheck,
  UserX,
  ArrowUpRight,
  Activity,
  Clock3,
  Building2,
  Sparkles
} from 'lucide-react';

const statCards = [

  {
    title: 'Total Members',
    value: dashboardStats.totalMembers,
    icon: Users,
    color: '#0066CC',
    growth: '+12%'
  },

  {
    title: 'Active Members',
    value: dashboardStats.activeMembers,
    icon: UserCheck,
    color: '#00AA55',
    growth: '+8%'
  },

  {
    title: 'Inactive Members',
    value: dashboardStats.inactiveMembers,
    icon: UserX,
    color: '#FFAA00',
    growth: '-2%'
  },

  {
    title: 'Stations',
    value: dashboardStats.totalStations,
    icon: MapPin,
    color: '#7C3AED',
    growth: '+5%'
  },

  {
    title: 'Zones',
    value: dashboardStats.totalZones,
    icon: Map,
    color: '#00AA55',
    growth: '+4%'
  },

  {
    title: 'Teachings',
    value: dashboardStats.totalTeachings,
    icon: BookOpen,
    color: '#FF8800',
    growth: '+15%'
  }
];

const generationData = [

  {
    label: 'Generation 1',
    key: 'G1',
    count: dashboardStats.generationDistribution.G1,
    color: '#0066CC'
  },

  {
    label: 'Generation 2',
    key: 'G2',
    count: dashboardStats.generationDistribution.G2,
    color: '#00AA55'
  },

  {
    label: 'Generation 3',
    key: 'G3',
    count: dashboardStats.generationDistribution.G3,
    color: '#FFAA00'
  }
];

export default function DashboardPage() {

  const recentMembers = mockMembers.slice(0, 5);

  const recentTeachings = mockTeachings.slice(0, 4);

  const totalGen = dashboardStats.totalMembers;

  return (

    <div
      className="space-y-8"
      data-testid="dashboard-page"
    >

      {/* 🔹 HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0055AA] via-[#0066CC] to-[#1E88E5] text-white shadow-xl">

        {/* BACKGROUND */}
        <div className="absolute inset-0">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>

        </div>

        <div className="relative z-10 p-8 md:p-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">

                  <Sparkles className="h-7 w-7 text-white" />

                </div>

                <div>

                  <h1 className="text-3xl md:text-4xl font-bold">
                    Dashboard
                  </h1>

                  <p className="text-white/80 mt-1">
                    Bienvenue. Voici un aperçu global de votre communauté.
                  </p>

                </div>

              </div>

              <div className="flex flex-wrap gap-4 mt-6">

                <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4 min-w-[140px]">

                  <p className="text-white/70 text-sm">
                    Membres actifs
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {dashboardStats.activeMembers}
                  </h2>

                </div>

                <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4 min-w-[140px]">

                  <p className="text-white/70 text-sm">
                    Stations
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {dashboardStats.totalStations}
                  </h2>

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="bg-white/10 backdrop-blur rounded-3xl p-6 min-w-[300px]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-white/70 text-sm">
                    Croissance mensuelle
                  </p>

                  <h2 className="text-5xl font-bold mt-2">
                    +18%
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">

                  <TrendingUp className="h-7 w-7 text-white" />

                </div>

              </div>

              <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">

                <div className="w-[78%] h-full bg-white rounded-full"></div>

              </div>

              <p className="text-sm text-white/70 mt-3">
                Activité globale de la communauté
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* 🔹 STATS */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        data-testid="stat-cards"
      >

        {statCards.map((stat, i) => (

          <Card
            key={stat.title}
            className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group"
          >

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                {/* LEFT */}
                <div>

                  <p className="text-xs uppercase tracking-[0.15em] font-semibold text-gray-400">

                    {stat.title}

                  </p>

                  <h2 className="text-4xl font-bold text-[#222] mt-3">

                    {stat.value}

                  </h2>

                  <div className="flex items-center gap-1 mt-4 text-sm font-medium text-green-600">

                    <ArrowUpRight className="h-4 w-4" />

                    {stat.growth}

                    <span className="text-gray-400 font-normal">
                      ce mois
                    </span>

                  </div>

                </div>

                {/* ICON */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${stat.color}15`
                  }}
                >

                  <stat.icon
                    className="h-7 w-7"
                    style={{
                      color: stat.color
                    }}
                  />

                </div>

              </div>

            </CardContent>

          </Card>
        ))}

      </div>

      {/* 🔹 MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* 🔹 DISTRIBUTION */}
        <Card className="border-0 rounded-3xl shadow-sm overflow-hidden">

          <CardHeader className="pb-2">

            <CardTitle className="flex items-center gap-2 text-[#222]">

              <TrendingUp className="h-5 w-5 text-[#0066CC]" />

              Distribution des générations

            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-6 pt-4">

            {generationData.map((gen) => (

              <div key={gen.key}>

                <div className="flex items-center justify-between mb-2">

                  <span className="text-sm font-medium text-[#333]">

                    {gen.label}

                  </span>

                  <span className="text-xs text-gray-500">

                    {gen.count} / {totalGen}

                  </span>

                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(gen.count / totalGen) * 100}%`,
                      backgroundColor: gen.color
                    }}
                  />

                </div>

              </div>
            ))}

            {/* TOTAL */}
            <div className="mt-8 bg-[#F8FAFC] rounded-2xl p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Total membres
                  </p>

                  <h2 className="text-3xl font-bold text-[#222] mt-1">
                    {dashboardStats.totalMembers}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#0066CC]/10 flex items-center justify-center">

                  <Users className="h-6 w-6 text-[#0066CC]" />

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* 🔹 RECENT MEMBERS */}
        <Card className="border-0 rounded-3xl shadow-sm overflow-hidden">

          <CardHeader className="pb-2">

            <CardTitle className="flex items-center gap-2 text-[#222]">

              <Users className="h-5 w-5 text-[#0066CC]" />

              Membres récents

            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-4 pt-4">

            {recentMembers.map((member) => (

              <div
                key={member.id}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >

                {/* AVATAR */}
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">

                  <AvatarImage
                    src={member.avatar}
                    alt={member.firstName}
                  />

                  <AvatarFallback className="bg-[#0066CC]/10 text-[#0066CC] font-semibold">

                    {member.firstName[0]}
                    {member.lastName[0]}

                  </AvatarFallback>

                </Avatar>

                {/* INFO */}
                <div className="flex-1 min-w-0">

                  <p className="font-semibold text-[#222] truncate">

                    {member.firstName} {member.lastName}

                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

                    <Building2 className="h-4 w-4" />

                    {member.station}

                  </div>

                </div>

                {/* STATUS */}
                <Badge
                  className={`rounded-xl px-3 py-1 text-[11px] font-semibold ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-orange-100 text-orange-700 border-orange-200'
                  }`}
                  variant="outline"
                >

                  {member.status}

                </Badge>

              </div>
            ))}

          </CardContent>

        </Card>

        {/* 🔹 TEACHINGS */}
        <Card className="border-0 rounded-3xl shadow-sm overflow-hidden">

          <CardHeader className="pb-2">

            <CardTitle className="flex items-center gap-2 text-[#222]">

              <BookOpen className="h-5 w-5 text-[#0066CC]" />

              Enseignements récents

            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-4 pt-4">

            {recentTeachings.map((teaching) => (

              <div
                key={teaching.id}
                className="rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="font-semibold text-[#222]">

                      {teaching.title}

                    </h3>

                    <p className="text-sm text-gray-500 mt-2">

                      {teaching.speaker}

                    </p>

                  </div>

                  <div className="w-11 h-11 rounded-xl bg-[#0066CC]/10 flex items-center justify-center">

                    <BookOpen className="h-5 w-5 text-[#0066CC]" />

                  </div>

                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">

                  <Clock3 className="h-4 w-4" />

                  {teaching.duration}

                </div>

              </div>
            ))}

            {/* FOOTER */}
            <div className="bg-[#F8FAFC] rounded-2xl p-5 mt-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Total enseignements
                  </p>

                  <h2 className="text-3xl font-bold text-[#222] mt-1">
                    {dashboardStats.totalTeachings}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#0066CC]/10 flex items-center justify-center">

                  <Activity className="h-6 w-6 text-[#0066CC]" />

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}