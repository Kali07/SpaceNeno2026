import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard, Users, MapPin, Map, BookOpen,
  Settings, User, LogOut, Menu, X, Bell, ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/members', label: 'Membres', icon: Users },
  { to: '/stations', label: 'Stations', icon: MapPin },
  { to: '/villes', label: 'Villes', icon: Map },
  { to: '/teachings', label: 'Enseignements', icon: BookOpen },
  { to: '/approvals', label: 'Autorisation', icon: X },
  { to: '/administration', label: 'Administration', icon: Settings },
  { to: '/profile', label: 'Profile', icon: User },
];

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0066CC] flex items-center justify-center">
            <span className="text-white font-bold text-sm font-heading">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight font-heading text-[#333333]">NENO SPACE</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden" data-testid="close-sidebar-btn">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <Separator />
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar" data-testid="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            data-testid={`nav-${item.label.toLowerCase()}`}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : 'text-[#666666] hover:text-[#333333]'}`
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4">
        <div className="rounded-lg bg-[#0066CC]/5 p-3">
          <p className="text-xs font-semibold text-[#0066CC] tracking-wide uppercase">Communauté</p>
          <p className="text-xs text-[#666666] mt-1"> Gestion de 16 membres dans 9 stations</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD';

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-40" data-testid="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50" data-testid="mobile-sidebar">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-4 md:px-6 lg:px-8" data-testid="app-header">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                data-testid="open-sidebar-btn"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative" data-testid="notifications-btn">
                <Bell className="h-5 w-5 text-[#666666]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFAA00] rounded-full" />
              </Button>

              <Separator orientation="vertical" className="h-8" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2" data-testid="user-menu-trigger">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#0066CC] text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-[#333333]">{user?.name}</p>
                      <p className="text-xs text-[#666666]">{user?.role?.label}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#666666] hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="menu-profile">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/administration')} data-testid="menu-admin">
                    <Settings className="mr-2 h-4 w-4" /> Administration
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600" data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" /> Se Déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
