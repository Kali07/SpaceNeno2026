import { mockTeachings } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { BookOpen, Clock, User, Calendar } from 'lucide-react';

const topicColors = {
  Leadership: { bg: 'bg-[#0066CC]/10', text: 'text-[#0066CC]', border: 'border-[#0066CC]/20' },
  Growth: { bg: 'bg-[#00AA55]/10', text: 'text-[#00AA55]', border: 'border-[#00AA55]/20' },
  Community: { bg: 'bg-[#FFAA00]/10', text: 'text-[#FFAA00]', border: 'border-[#FFAA00]/20' },
  Prayer: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  Youth: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  Finance: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  Outreach: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  Relationships: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

export default function TeachingsPage() {
  return (
    <div className="space-y-6" data-testid="teachings-page">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[#333333]">Teachings</h1>
        <p className="text-sm text-[#666666] mt-1">{mockTeachings.length} teachings recorded</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#0066CC]/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#0066CC]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#666666]">Total</p>
              <p className="text-2xl font-bold font-heading text-[#333333]">{mockTeachings.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#00AA55]/10 flex items-center justify-center">
              <User className="h-5 w-5 text-[#00AA55]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#666666]">Speakers</p>
              <p className="text-2xl font-bold font-heading text-[#333333]">
                {new Set(mockTeachings.map(t => t.speaker)).size}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#FFAA00]/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#FFAA00]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#666666]">Topics</p>
              <p className="text-2xl font-bold font-heading text-[#333333]">
                {new Set(mockTeachings.map(t => t.topic)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachings Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <Table data-testid="teachings-table">
          <TableHeader>
            <TableRow className="bg-[#F5F5F5]">
              <TableHead className="font-semibold text-[#333333]">Teaching</TableHead>
              <TableHead className="font-semibold text-[#333333] hidden md:table-cell">Speaker</TableHead>
              <TableHead className="font-semibold text-[#333333] hidden lg:table-cell">Date</TableHead>
              <TableHead className="font-semibold text-[#333333]">Topic</TableHead>
              <TableHead className="font-semibold text-[#333333] hidden md:table-cell">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTeachings.map((teaching) => {
              const colors = topicColors[teaching.topic] || topicColors.Leadership;
              return (
                <TableRow key={teaching.id} className="hover:bg-gray-50" data-testid={`teaching-row-${teaching.id}`}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-[#333333]">{teaching.title}</p>
                      <p className="text-xs text-[#666666] mt-0.5 line-clamp-1">{teaching.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-[#666666]">{teaching.speaker}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-[#666666]">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(teaching.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
                      {teaching.topic}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-[#666666]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {teaching.duration}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
