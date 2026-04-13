# NENO SPACE - Community Management Dashboard

## Original Problem Statement
Build a modern React interface for a community management internal platform with login, dashboard, sidebar navigation, and multiple pages (Members, Stations, Zones, Teachings, Administration, Profile).

## Architecture
- **Frontend-only** (React + Tailwind CSS + Shadcn UI)
- Mock data in frontend - designed to later connect to a Laravel REST API backend
- No backend/database needed for V1

## User Personas
- **Admin**: Full access to all pages, user management
- **Moderator**: Limited admin capabilities
- **Viewer**: Dashboard and member viewing

## Core Requirements (Static)
- Login page with split-screen layout
- Dashboard with stat cards
- Members CRUD with search/filter/table
- Stations, Zones, Teachings listing
- Administration user management
- Profile settings

## What's Been Implemented (2026-04-13)
- Login page: split-screen with NENO SPACE branding + 3D background
- Dashboard: 6 stat cards + generation distribution + recent members + recent teachings
- Members: full table with search, station/status/generation filters, Add Member dialog
- Member Detail: profile view + editable fields + file upload UI
- Stations: 9 station cards with status badges
- Zones: 4 zone cards with station/member counts
- Teachings: table with 8 teachings + topic badges + summary cards
- Administration: admin user table with role badges + dropdown actions
- Profile: tabs (General/Security/Notifications) + avatar upload UI
- Auth: mock JWT with localStorage persistence
- Design: Swiss/High-Contrast archetype, Outfit+Manrope fonts, NENO SPACE color palette

## Test Credentials
- Email: admin@nenospace.com
- Password: admin123

## Prioritized Backlog
### P0 (Next Phase)
- Connect to Laravel REST API backend
- Real authentication (JWT)
- Real CRUD operations for members, stations, zones

### P1
- File upload functionality (images for member profiles)
- Export data to CSV
- Pagination for large datasets
- Real-time notifications

### P2
- Advanced analytics/charts on dashboard
- Bulk member import
- Role-based access control
- Mobile app version

## Color Palette
- Primary: #0066CC
- Secondary: #00AA55
- Accent: #FFAA00
- Background: #F5F5F5
- Text Primary: #333333
- Text Secondary: #666666
