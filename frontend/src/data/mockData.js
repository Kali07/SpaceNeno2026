const AVATARS = [
  "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc3NjAzOTc2OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc3NjAzOTc2OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1762522926157-bcc04bf0b10a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc3NjAzOTc2OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1769636929388-99eff95d3bf1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc3NjAzOTc2OXww&ixlib=rb-4.1.0&q=85",
];

export const LOGIN_BG = "/img/LOGO_50-2.png";
export const LOGO = "/img/NenoSpace-22-logo.png";
export const LOGO_NAME = "/img/NenoSpace-22.png";

const getAvatar = (index) => AVATARS[index % AVATARS.length];

export const mockVilles = [
  { id: "v1", name: "Ville Nord", description: "Northern region covering downtown and suburbs", stationCount: 3, memberCount: 45, leader: "Marc Dupont" },
  { id: "v2", name: "Ville Sud", description: "Southern region including riverside districts", stationCount: 2, memberCount: 32, leader: "Claire Fontaine" },
  { id: "v3", name: "Ville Est", description: "Eastern region covering industrial and residential areas", stationCount: 2, memberCount: 28, leader: "Jean-Pierre Martin" },
  { id: "v4", name: "Ville Ouest", description: "Western region spanning the commercial center", stationCount: 2, memberCount: 35, leader: "Sophie Bernard" },
];

export const mockStations = [
  { id: "s1", name: "Station Centrale", address: "12 Rue de la Paix, Centre-Ville", leader: "Paul Moreau", memberCount: 18, villeId: "v1", villeName: "Ville Nord", status: "active" },
  { id: "s2", name: "Station Victoire", address: "45 Avenue Victor Hugo", leader: "Marie Lambert", memberCount: 15, villeId: "v1", villeName: "Ville Nord", status: "active" },
  { id: "s3", name: "Station Espoir", address: "78 Boulevard des Lilas", leader: "David Rousseau", memberCount: 12, villeId: "v1", villeName: "Ville Nord", status: "active" },
  { id: "s4", name: "Station Lumiere", address: "23 Rue du Soleil", leader: "Anne Leroy", memberCount: 16, villeId: "v2", villeName: "Ville Sud", status: "active" },
  { id: "s5", name: "Station Grace", address: "56 Avenue de la Liberte", leader: "Thomas Petit", memberCount: 16, villeId: "v2", villeName: "Ville Sud", status: "active" },
  { id: "s6", name: "Station Renaissance", address: "89 Rue Voltaire", leader: "Isabelle Duval", memberCount: 14, villeId: "v3", villeName: "Ville Est", status: "active" },
  { id: "s7", name: "Station Horizon", address: "34 Boulevard de l'Avenir", leader: "Jean-Marc Dupuis", memberCount: 20, villeId: "v3", villeName: "Ville Est", status: "active" },
  { id: "s8", name: "Station Alliance", address: "67 Rue Montesquieu", leader: "Camille Robert", memberCount: 19, villeId: "v4", villeName: "Ville Ouest", status: "active" },
  { id: "s9", name: "Station Bethel", address: "11 Avenue Pasteur", leader: "Luc Mercier", memberCount: 16, villeId: "v4", villeName: "Ville Ouest", status: "active" },
];

export const mockMembers = [
  { id: "m1", firstName: "Jean", lastName: "Kambale", email: "jean.kambale@email.com", phone: "+243 812 345 678", stationId: "s1", station: "Station Centrale", villeId: "v1", ville: "Ville Nord", status: "active", generation: "G1", role: "Leader", joinDate: "2021-03-15", avatar: getAvatar(0) },
  { id: "m2", firstName: "Grace", lastName: "Mbuyi", email: "grace.mbuyi@email.com", phone: "+243 823 456 789", stationId: "s1", station: "Station Centrale", villeId: "v1", ville: "Ville Nord", status: "active", generation: "G2", role: "Member", joinDate: "2022-06-20", avatar: getAvatar(1) },
  { id: "m3", firstName: "Samuel", lastName: "Ilunga", email: "samuel.ilunga@email.com", phone: "+243 834 567 890", stationId: "s2", station: "Station Victoire", villeId: "v1", ville: "Ville Nord", status: "active", generation: "G1", role: "Assistant", joinDate: "2021-01-10", avatar: getAvatar(2) },
  { id: "m4", firstName: "Esther", lastName: "Mukendi", email: "esther.mukendi@email.com", phone: "+243 845 678 901", stationId: "s2", station: "Station Victoire", villeId: "v1", ville: "Ville Nord", status: "inactive", generation: "G3", role: "Member", joinDate: "2023-09-05", avatar: getAvatar(3) },
  { id: "m5", firstName: "Patrick", lastName: "Tshimanga", email: "patrick.tshimanga@email.com", phone: "+243 856 789 012", stationId: "s3", station: "Station Espoir", villeId: "v1", ville: "Ville Nord", status: "active", generation: "G2", role: "Leader", joinDate: "2022-02-28", avatar: getAvatar(0) },
  { id: "m6", firstName: "Rachel", lastName: "Kasongo", email: "rachel.kasongo@email.com", phone: "+243 867 890 123", stationId: "s4", station: "Station Lumiere", villeId: "v2", ville: "Ville Sud", status: "active", generation: "G1", role: "Member", joinDate: "2021-04-25", avatar: getAvatar(1) },
  { id: "m10", firstName: "Marie", lastName: "Lumumba", email: "marie.lumumba@email.com", phone: "+243 801 234 567", stationId: "s6", station: "Station Renaissance",villeId: "v3", ville: "Ville Est", status: "active", generation: "G2", role: "Member", joinDate: "2022-07-14", avatar: getAvatar(1) },
  { id: "m11", firstName: "Daniel", lastName: "Mwamba", email: "daniel.mwamba@email.com", phone: "+243 812 345 679", stationId: "s6", station: "Station Renaissance",villeId: "v3", ville: "Ville Est", status: "active", generation: "G1", role: "Assistant", joinDate: "2021-04-25", avatar: getAvatar(2) },
  { id: "m12", firstName: "Ruth", lastName: "Kayembe", email: "ruth.kayembe@email.com", phone: "+243 823 456 780", stationId: "s7", station: "Station Horizon", villeId: "v3", ville: "Ville Est", status: "active", generation: "G3", role: "Member", joinDate: "2024-03-10", avatar: getAvatar(3) },
  { id: "m13", firstName: "Emmanuel", lastName: "Tshibangu", email: "emmanuel.tshibangu@email.com", phone: "+243 834 567 891", stationId: "s8", station: "Station Alliance", villeId: "v4", ville: "Ville Ouest", status: "active", generation: "G2", role: "Leader", joinDate: "2022-09-01", avatar: getAvatar(0) },
  { id: "m14", firstName: "Deborah", lastName: "Nzuzi", email: "deborah.nzuzi@email.com", phone: "+243 845 678 902", stationId: "s8", station: "Station Alliance", villeId: "v4", ville: "Ville Ouest", status: "inactive", generation: "G1", role: "Member", joinDate: "2021-12-05", avatar: getAvatar(1) },
  { id: "m15", firstName: "Benjamin", lastName: "Kalala", email: "benjamin.kalala@email.com", phone: "+243 856 789 013", stationId: "s9", station: "Station Bethel", villeId: "v4", ville: "Ville Ouest", status: "active", generation: "G3", role: "Assistant", joinDate: "2023-06-18", avatar: getAvatar(2) },

];

export const mockTeachings = [
  { id: "t1", title: "Leadership and Service", speaker: "Pastor Marc Dupont", date: "2024-12-15", topic: "Leadership", description: "Understanding servant leadership in community building", duration: "45 min" },
  { id: "t2", title: "Building Strong Foundations", speaker: "Elder Claire Fontaine", date: "2024-12-08", topic: "Growth", description: "How to build a strong spiritual foundation for community members", duration: "30 min" },
  { id: "t3", title: "Unity in Diversity", speaker: "Pastor Jean-Pierre Martin", date: "2024-11-24", topic: "Community", description: "Celebrating and leveraging diversity within our community", duration: "50 min" },
  { id: "t4", title: "Prayer and Intercession", speaker: "Elder Sophie Bernard", date: "2024-11-17", topic: "Prayer", description: "Effective prayer strategies for community transformation", duration: "40 min" },
  { id: "t5", title: "Youth Empowerment", speaker: "David Rousseau", date: "2024-11-10", topic: "Youth", description: "Engaging and empowering the next generation of leaders", duration: "35 min" },
  { id: "t6", title: "Financial Stewardship", speaker: "Thomas Petit", date: "2024-11-03", topic: "Finance", description: "Biblical principles for financial management", duration: "45 min" },
  { id: "t7", title: "Community Outreach", speaker: "Pastor Marc Dupont", date: "2024-10-27", topic: "Outreach", description: "Strategies for effective community outreach programs", duration: "55 min" },
  { id: "t8", title: "Conflict Resolution", speaker: "Elder Claire Fontaine", date: "2024-10-20", topic: "Relationships", description: "Resolving conflicts with grace and wisdom", duration: "40 min" },
];

export const mockAdminUsers = [
  { id: "a1", name: "Admin Principal", email: "admin@nenospace.com", role: "Super Admin", status: "active", lastLogin: "2024-12-20T10:30:00Z" },
  { id: "a2", name: "Marc Dupont", email: "marc.dupont@nenospace.com", role: "Admin", status: "active", lastLogin: "2024-12-19T14:15:00Z" },
  { id: "a3", name: "Claire Fontaine", email: "claire.fontaine@nenospace.com", role: "Moderator", status: "active", lastLogin: "2024-12-18T09:45:00Z" },
  { id: "a4", name: "Jean-Pierre Martin", email: "jp.martin@nenospace.com", role: "Moderator", status: "inactive", lastLogin: "2024-11-30T16:20:00Z" },
];

export const dashboardStats = {
  totalMembers: mockMembers.length,
  activeMembers: mockMembers.filter(m => m.status === "active").length,
  inactiveMembers: mockMembers.filter(m => m.status === "inactive").length,
  totalStations: mockStations.length,
  activeStations: mockStations.filter(s => s.status === "active").length,
  totalVilles: mockVilles.length,
  totalTeachings: mockTeachings.length,
  generationDistribution: {
    G1: mockMembers.filter(m => m.generation === "G1").length,
    G2: mockMembers.filter(m => m.generation === "G2").length,
    G3: mockMembers.filter(m => m.generation === "G3").length,
  },
};
