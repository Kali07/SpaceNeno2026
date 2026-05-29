import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  MapPin,
  Users,
  Phone,
  Mail,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Globe,
  MapPinned
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { getStations } from "../api/stationApi";

export default function StationDetailPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [station, setStation] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchStation = async () => {

      try {

        // 🔹 récupération des stations
        const data = await getStations();

        // 🔹 récupération de la station ciblée
        const found = data.find(
          (s) => s.id == id
        );

        setStation(found);

      } catch (error) {

        showMessage(
          "Erreur chargement station :",
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

    fetchStation();

  }, [id]);

  // 🔹 LOADING
  if (loading) {

    return (

      <div className="flex justify-center items-center h-[60vh]">

        <div className="animate-pulse text-gray-500 text-lg">
          Chargement...
        </div>

      </div>
    );
  }

  // 🔹 NOT FOUND
  if (!station) {

    return (

      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">

        <p className="text-lg font-medium text-gray-700">
          Station introuvable
        </p>

        <Button
          variant="outline"
          onClick={() => navigate("/stations")}
        >

          <ArrowLeft className="h-4 w-4 mr-2" />

          Retour aux stations

        </Button>

      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* 🔹 HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div className="flex items-center gap-4">

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/stations")}
            className="rounded-full shadow-sm"
          >

            <ArrowLeft className="h-5 w-5" />

          </Button>

          <div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#222]">
              {station.name}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Détails complets de la station
            </p>

          </div>

        </div>

      </div>

      {/* 🔹 HERO */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg bg-gradient-to-r from-[#0055AA] via-[#0066CC] to-[#1E88E5] text-white">

        {/* overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10 p-8 md:p-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            {/* LEFT */}
            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">

                  <Building2 className="h-8 w-8 text-white" />

                </div>

                <div>

                  <h2 className="text-4xl font-bold">
                    {station.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-2 text-white/90">

                    <MapPin className="h-4 w-4" />

                    <span className="text-sm">
                      {station.ville?.name || "Ville inconnue"}
                    </span>

                  </div>

                </div>

              </div>

              <p className="max-w-2xl text-white/90 leading-relaxed text-sm md:text-base">

                {station.description ||
                  "Cette station fait partie du réseau principal de gestion et permet la supervision des opérations locales ainsi que la coordination des membres affiliés."}

              </p>

            </div>

            {/* RIGHT STATS */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 min-w-[140px]">

                <div className="flex items-center gap-2 text-white/80 text-sm">

                  <Users className="h-4 w-4" />

                  Membres

                </div>

                <h3 className="text-3xl font-bold mt-2">
                  {station.users_count || 0}
                </h3>

              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 min-w-[140px]">

                <div className="flex items-center gap-2 text-white/80 text-sm">

                  <ShieldCheck className="h-4 w-4" />

                  Responsable

                </div>

                <h3 className="text-lg font-semibold mt-2">
                  {station.responsable?.name || "Non défini"}
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 🔹 CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 🔹 LEFT PANEL */}
        <div className="space-y-6">

          {/* INFOS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <h2 className="text-lg font-semibold text-[#333] mb-6">
              Informations générales
            </h2>

            <div className="space-y-5">

              {/* RESPONSABLE */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <Users className="h-5 w-5 text-[#0066CC]" />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Responsable
                  </p>

                  <p className="font-semibold text-[#222] mt-1">
                    {station.responsable?.name || "Non défini"}
                  </p>

                </div>

              </div>

              {/* ADRESSE */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <MapPinned className="h-5 w-5 text-[#0066CC]" />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Adresse
                  </p>

                  <p className="font-semibold text-[#222] mt-1">
                    {station.address || "Adresse non définie"}
                  </p>

                </div>

              </div>

              {/* TELEPHONE */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <Phone className="h-5 w-5 text-[#0066CC]" />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Téléphone
                  </p>

                  <p className="font-semibold text-[#222] mt-1">
                    {station.phone || "Non renseigné"}
                  </p>

                </div>

              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <Mail className="h-5 w-5 text-[#0066CC]" />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <p className="font-semibold text-[#222] mt-1">
                    {station.email || "Non renseigné"}
                  </p>

                </div>

              </div>

              {/* VILLE */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <Globe className="h-5 w-5 text-[#0066CC]" />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Ville
                  </p>

                  <p className="font-semibold text-[#222] mt-1">
                    {station.ville?.name || "Inconnue"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* 🔹 RIGHT PANEL */}
        <div className="lg:col-span-2 space-y-6">

          {/* DESCRIPTION */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <h2 className="text-xl font-semibold text-[#333] mb-4">
              À propos de cette station
            </h2>

            <p className="text-gray-600 leading-relaxed">

              {station.description ||
                "Aucune description disponible pour cette station. Cette station participe activement à la gestion des opérations et à la coordination des ressources locales."}

            </p>

          </div>

          {/* MAP */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-semibold text-[#333]">
                Localisation
              </h2>

              <span className="text-sm text-gray-400">
                Google Maps
              </span>

            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100">

              <iframe
                title="map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  station.address || station.ville?.name || "Paris"
                )}&output=embed`}
                className="w-full h-[400px]"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}