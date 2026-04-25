import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { dashboardStats, mockMembers, mockTeachings } from '@/data/mockData';
import { Users, MapPin, Map, BookOpen, TrendingUp, UserCheck, UserX } from 'lucide-react';

const statCards = [
  { title: 'Total Members', value: dashboardStats.totalMembers, icon: Users, color: '#0066CC', bgColor: '#0066CC/10' },
  { title: 'Active Members', value: dashboardStats.activeMembers, icon: UserCheck, color: '#00AA55', bgColor: '#00AA55/10' },
  { title: 'Inactive Members', value: dashboardStats.inactiveMembers, icon: UserX, color: '#FFAA00', bgColor: '#FFAA00/10' },
  { title: 'Stations', value: dashboardStats.totalStations, icon: MapPin, color: '#0066CC', bgColor: '#0066CC/10' },
  { title: 'Zones', value: dashboardStats.totalZones, icon: Map, color: '#00AA55', bgColor: '#00AA55/10' },
  { title: 'Teachings', value: dashboardStats.totalTeachings, icon: BookOpen, color: '#FFAA00', bgColor: '#FFAA00/10' },
];

const generationData = [
  { label: 'Generation 1', key: 'G1', count: dashboardStats.generationDistribution.G1, color: '#0066CC' },
  { label: 'Generation 2', key: 'G2', count: dashboardStats.generationDistribution.G2, color: '#00AA55' },
  { label: 'Generation 3', key: 'G3', count: dashboardStats.generationDistribution.G3, color: '#FFAA00' },
];

export default function DashboardPage() {
  const recentMembers = mockMembers.slice(0, 5);
  const recentTeachings = mockTeachings.slice(0, 4);
  const totalGen = dashboardStats.totalMembers;

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[#333333]">Dashboard</h1>
        <p className="text-sm text-[#666666] mt-1">Bienvenue. Voici un aperçu de votre communauté.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" data-testid="stat-cards">
        {statCards.map((stat, i) => (
          <Card key={stat.title} className={`stat-card border border-gray-200 shadow-sm opacity-0 animate-fade-in-up animate-delay-${i + 1}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#666666]">{stat.title}</p>
                  <p className="text-3xl font-bold font-heading text-[#333333] mt-2">{stat.value}</p>
                </div>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Distribution */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold font-heading text-[#333333] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#0066CC]" />
              Generation Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-testid="generation-distribution">
            {generationData.map((gen) => (
              <div key={gen.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#333333] font-medium">{gen.label}</span>
                  <span className="text-[#666666] font-mono text-xs">{gen.count} / {totalGen}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(gen.count / totalGen) * 100}%`, backgroundColor: gen.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Members */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold font-heading text-[#333333] flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0066CC]" />
              Membres Récents
            </CardTitle>
          </CardHeader>
          <CardContent data-testid="recent-members">
            <div className="space-y-3">
              {recentMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar} alt={member.firstName} />
                    <AvatarFallback className="bg-[#0066CC]/10 text-[#0066CC] text-xs font-semibold">
                      {member.firstName[0]}{member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#333333] truncate">{member.firstName} {member.lastName}</p>
                    <p className="text-xs text-[#666666] truncate">{member.station}</p>
                  </div>
                  <Badge
                    className={`text-[10px] font-semibold px-2 py-0.5 ${
                      member.status === 'active'
                        ? 'bg-[#00AA55]/10 text-[#00AA55] border-[#00AA55]/20'
                        : 'bg-[#FFAA00]/10 text-[#FFAA00] border-[#FFAA00]/20'
                    }`}
                    variant="outline"
                  >
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Teachings */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold font-heading text-[#333333] flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#0066CC]" />
              Enseignements Récents
            </CardTitle>
          </CardHeader>
          <CardContent data-testid="recent-teachings">
            <div className="space-y-3">
              {recentTeachings.map((teaching) => (
                <div key={teaching.id} className="space-y-1 p-3 rounded-lg bg-[#F5F5F5] hover:bg-gray-100 transition-colors">
                  <p className="text-sm font-medium text-[#333333]">{teaching.title}</p>
                  <div className="flex items-center gap-2 text-xs text-[#666666]">
                    <span>{teaching.speaker}</span>
                    <span>-</span>
                    <span>{teaching.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
