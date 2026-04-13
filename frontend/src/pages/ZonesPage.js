import { mockZones } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Map, MapPin, Users } from 'lucide-react';

export default function ZonesPage() {
  return (
    <div className="space-y-6" data-testid="zones-page">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[#333333]">Zones</h1>
        <p className="text-sm text-[#666666] mt-1">{mockZones.length} zones organizing your community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" data-testid="zones-grid">
        {mockZones.map((zone) => (
          <Card
            key={zone.id}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            data-testid={`zone-card-${zone.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00AA55]/10 flex items-center justify-center flex-shrink-0">
                  <Map className="h-6 w-6 text-[#00AA55]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold font-heading text-[#333333]">{zone.name}</h3>
                  <p className="text-sm text-[#666666] mt-1">{zone.description}</p>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-[#0066CC]" />
                      <span className="text-[#333333] font-medium">{zone.stationCount} Stations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-[#0066CC]" />
                      <span className="text-[#333333] font-medium">{zone.memberCount} Members</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-[#666666]">
                      Zone Leader: <span className="font-semibold text-[#333333]">{zone.leader}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
