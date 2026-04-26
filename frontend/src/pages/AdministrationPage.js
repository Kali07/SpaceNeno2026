import { mockAdminUsers } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Shield, MoreHorizontal, UserCog, Trash2, KeyRound, Users } from 'lucide-react';

const roleColors = {
  'Super Admin': { bg: 'bg-[#0066CC]/10', text: 'text-[#0066CC]', border: 'border-[#0066CC]/20' },
  Admin: { bg: 'bg-[#FFAA00]/10', text: 'text-[#FFAA00]', border: 'border-[#FFAA00]/20' },
  Moderator: { bg: 'bg-[#00AA55]/10', text: 'text-[#00AA55]', border: 'border-[#00AA55]/20' },
};

export default function AdministrationPage() {
  return (
    <div className="space-y-6" data-testid="administration-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[#333333]">Administration</h1>
          <p className="text-sm text-[#666666] mt-1">Gérer les rôles et les permissions des utilisateurs</p>
        </div>
        <Button className="bg-[#0066CC] hover:bg-[#0055AA] text-white" data-testid="add-admin-btn">
          <Shield className="h-4 w-4 mr-2" /> Ajouter un Administrateur
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#0066CC]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#0066CC]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#666666]">Total Utilisateurs</p>
              <p className="text-2xl font-bold font-heading text-[#333333]">{mockAdminUsers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#00AA55]/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#00AA55]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#666666]">Active</p>
              <p className="text-2xl font-bold font-heading text-[#333333]">
                {mockAdminUsers.filter(u => u.status === 'active').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#FFAA00]/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-[#FFAA00]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#666666]">Roles</p>
              <p className="text-2xl font-bold font-heading text-[#333333]">
                {new Set(mockAdminUsers.map(u => u.role)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <Table data-testid="admin-users-table">
          <TableHeader>
            <TableRow className="bg-[#F5F5F5]">
              <TableHead className="font-semibold text-[#333333]">Utilisateur</TableHead>
              <TableHead className="font-semibold text-[#333333]">Role</TableHead>
              <TableHead className="font-semibold text-[#333333] hidden md:table-cell">Status</TableHead>
              <TableHead className="font-semibold text-[#333333] hidden lg:table-cell">Dernière Connexion</TableHead>
              <TableHead className="font-semibold text-[#333333] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAdminUsers.map((user) => {
              const colors = roleColors[user.role?.label] || roleColors.Moderator;
              return (
                <TableRow key={user.id} className="hover:bg-gray-50" data-testid={`admin-row-${user.id}`}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-[#333333]">{user.name}</p>
                      <p className="text-xs text-[#666666]">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
                      {user.role?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-[#00AA55]/10 text-[#00AA55] border-[#00AA55]/20'
                          : 'bg-gray-100 text-[#666666] border-gray-200'
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-[#666666]">
                    {new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`admin-actions-${user.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem data-testid={`edit-role-${user.id}`}>
                          <UserCog className="mr-2 h-4 w-4" /> Modifier le Role
                        </DropdownMenuItem>
                        <DropdownMenuItem data-testid={`reset-password-${user.id}`}>
                          <KeyRound className="mr-2 h-4 w-4" /> Réinitialiser le Mot de Passe
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" data-testid={`remove-user-${user.id}`}>
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer l'Utilisateur
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
