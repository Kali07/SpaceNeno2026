import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Upload, User, Lock, Bell } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+243 800 000 000',
    bio: 'Platform administrator for NENO SPACE community management.',
  });

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD';

  const update = (key, value) => setProfile({ ...profile, [key]: value });

  return (
    <div className="space-y-6" data-testid="profile-page">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[#333333]">Profile</h1>
        <p className="text-sm text-[#666666] mt-1">Gerer votre compte et ses paramètres</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-[#0066CC] text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" data-testid="profile-upload-avatar">
                  <Upload className="h-6 w-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <h2 className="mt-4 text-lg font-bold font-heading text-[#333333]">{user?.name}</h2>
              <p className="text-sm text-[#666666]">{user?.role}</p>
              <p className="text-xs text-[#0066CC] mt-1">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="general" className="data-[state=active]:bg-[#0066CC]/10 data-[state=active]:text-[#0066CC]" data-testid="tab-general">
                <User className="h-4 w-4 mr-1.5" /> General
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#0066CC]/10 data-[state=active]:text-[#0066CC]" data-testid="tab-security">
                <Lock className="h-4 w-4 mr-1.5" /> Sécurité
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[#0066CC]/10 data-[state=active]:text-[#0066CC]" data-testid="tab-notifications">
                <Bell className="h-4 w-4 mr-1.5" /> Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold font-heading text-[#333333]">Informations Générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Nom Complet</Label>
                      <Input value={profile.name} onChange={(e) => update('name', e.target.value)} data-testid="profile-name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Email</Label>
                      <Input value={profile.email} onChange={(e) => update('email', e.target.value)} data-testid="profile-email" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Téléphone</Label>
                      <Input value={profile.phone} onChange={(e) => update('phone', e.target.value)} data-testid="profile-phone" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Bio</Label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => update('bio', e.target.value)}
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      data-testid="profile-bio"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-[#00AA55] hover:bg-[#009944] text-white" data-testid="save-profile-btn">
                      <Save className="h-4 w-4 mr-2" /> Enregistrer les Modifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold font-heading text-[#333333]">Changer le Mot de Passe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Mot de Passe Actuel</Label>
                    <Input type="password" placeholder="Enter current password" data-testid="current-password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Nouveau Mot de Passe</Label>
                      <Input type="password" placeholder="Enter new password" data-testid="new-password" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[#666666] text-xs uppercase tracking-wide font-semibold">Confirmer le Mot de Passe</Label>
                      <Input type="password" placeholder="Confirm new password" data-testid="confirm-password" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-[#0066CC] hover:bg-[#0055AA] text-white" data-testid="update-password-btn">
                      Changer le Mot de Passe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold font-heading text-[#333333]">Préférences de Notification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#666666]">Les paramètres de notification seront disponibles une fois le backend connecté.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
