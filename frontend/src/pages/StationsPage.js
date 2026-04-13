import { mockStations, mockZones } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Map } from 'lucide-react';

export default function StationsPage() {
  return (
    <div className="space-y-6" data-testid="stations-page">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[#333333]">Stations</h1>
        <p className="text-sm text-[#666666] mt-1">{mockStations.length} stations across {mockZones.length} zones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" data-testid="stations-grid">
        {mockStations.map((station) => (
          <Card
            key={station.id}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            data-testid={`station-card-${station.id}`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#0066CC]/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#0066CC]" />
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${
                    station.status === 'active'
                      ? 'bg-[#00AA55]/10 text-[#00AA55] border-[#00AA55]/20'
                      : 'bg-gray-100 text-[#666666] border-gray-200'
                  }`}
                >
                  {station.status}
                </Badge>
              </div>

              <h3 className="text-base font-semibold font-heading text-[#333333]">{station.name}</h3>
              <p className="text-xs text-[#666666] mt-1">{station.address}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3.5 w-3.5 text-[#666666]" />
                  <span className="text-[#666666]">Leader:</span>
                  <span className="text-[#333333] font-medium">{station.leader}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3.5 w-3.5 text-[#666666]" />
                  <span className="text-[#666666]">Members:</span>
                  <span className="text-[#333333] font-medium">{station.memberCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Map className="h-3.5 w-3.5 text-[#666666]" />
                  <span className="text-[#666666]">Zone:</span>
                  <span className="text-[#0066CC] font-medium">{station.zoneName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
