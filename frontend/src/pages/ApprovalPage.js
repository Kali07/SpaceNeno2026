import { useEffect, useState } from "react";

import {
  getApprovals,
  approveRequest,
  rejectRequest
} from "../api/approvalApi";

import { useMessage } from "../context/MessageContext";

import { getRoles } from "../api/roleApi";

import { getStations } from "../api/stationApi";

import { getGenerations } from "../api/generationApi";

import {
  Card,
  CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  CheckCircle2,
  XCircle,
  User,
  Shield,
  Building2,
  Sparkles,
  RefreshCcw,
  Mail,
  ArrowRight
} from "lucide-react";

export default function ApprovalsPage() {

  const [approvals, setApprovals] = useState([]);

  const [roles, setRoles] = useState([]);

  const [stations, setStations] = useState([]);

  const [generations, setGenerations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const { showMessage } = useMessage();

  // FETCH
  const fetchApprovals = async () => {

    try {

      setLoading(true);

      const [
        approvalsData,
        rolesData,
        stationsData,
        generationsData
      ] = await Promise.all([

        getApprovals(),

        getRoles(),

        getStations(),

        getGenerations()

      ]);

      setApprovals(approvalsData);

      setRoles(rolesData);

      setStations(stationsData);

      setGenerations(generationsData);

      setError("");

    } catch (err) {

      console.error(err);

      setError(
        "Erreur lors du chargement des demandes"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchApprovals();

  }, []);

  // HELPERS
  const getRoleName = (id) => {

    return roles.find(
      r => r.id == id
    )?.label || "N/A";
  };

  const getStationName = (id) => {

    return stations.find(
      s => s.id == id
    )?.name || "N/A";
  };

  const getGenerationName = (id) => {

    return generations.find(
      g => g.id == id
    )?.label || "N/A";
  };

  // APPROVE
  const handleApprove = async (id) => {

    try {

      const data =
        await approveRequest(id);

      fetchApprovals();

      if (
        data.message === "Approved"
      ) {

        showMessage(
          "Demande approuvée avec succès"
        );

      }

    } catch (err) {

      console.error(err);

      showMessage(
        "Vous n'avez pas ce privilège !",
        "error"
      );
    }
  };

  // REJECT
  const handleReject = async (id) => {

    try {

      const data =
        await rejectRequest(id);

      fetchApprovals();

      if (
        data.message === "Rejected"
      ) {

        showMessage(
          "Demande rejetée avec succès"
        );

      }

    } catch (err) {

      console.error(err);

      showMessage(
        "Vous n'avez pas ce privilège !",
        "error"
      );
    }
  };

  // LOADING
  if (loading) {

    return (

      <div className="flex items-center justify-center h-[70vh]">

        <div className="text-center">

          <RefreshCcw className="h-10 w-10 animate-spin text-[#0066CC] mx-auto mb-4" />

          <p className="text-lg text-gray-500">

            Chargement des demandes...

          </p>

        </div>

      </div>
    );
  }

  // ERROR
  if (error) {

    return (

      <div className="p-8">

        <Card className="border-red-200 bg-red-50">

          <CardContent className="p-6 text-red-600">

            {error}

          </CardContent>

        </Card>

      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#00AAFF] p-8 shadow-2xl">

        <div className="absolute top-0 right-0 opacity-10">

          <Shield className="w-72 h-72 text-white" />

        </div>

        <div className="relative z-10">

          <div className="flex items-center gap-4 mb-4">

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">

              <CheckCircle2 className="h-8 w-8 text-white" />

            </div>

            <div>

              <h1 className="text-4xl font-bold text-white">

                Demandes d'approbation

              </h1>

              <p className="text-blue-100 mt-2 text-lg">

                Gestion des validations et modifications

              </p>

            </div>

          </div>

          <div className="mt-6">

            <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-2 rounded-2xl">

              {approvals.length}
              {" "}
              demande(s) en attente

            </Badge>

          </div>

        </div>

      </div>

      {/* EMPTY */}
      {approvals.length === 0 ? (

        <Card className="rounded-3xl shadow-xl border-0">

          <CardContent className="p-16 text-center">

            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />

            <h2 className="text-2xl font-bold text-[#111] mb-3">

              Aucune demande en attente

            </h2>

            <p className="text-gray-500">

              Toutes les demandes ont été traitées.

            </p>

          </CardContent>

        </Card>

      ) : (

        <div className="space-y-6">

          {approvals.map((approval) => {

            const data =
              JSON.parse(approval.data);

            const oldData =
              approval.old_data
                ? JSON.parse(
                    approval.old_data
                  )
                : null;

            return (

              <Card
                key={approval.id}
                className="rounded-3xl border-0 shadow-xl overflow-hidden"
              >

                <CardContent className="p-0">

                  {/* HEADER */}
                  <div className="bg-gradient-to-r from-[#F8FAFF] to-[#EEF5FF] px-8 py-6 border-b">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div>

                        <div className="flex items-center gap-3 mb-3">

                          <Badge className="bg-[#0066CC] text-white rounded-xl px-3 py-1">

                            {approval.action}

                          </Badge>

                          <Badge
                            variant="outline"
                            className="rounded-xl"
                          >

                            #{approval.id}

                          </Badge>

                        </div>

                        <h2 className="text-2xl font-bold text-[#111]">

                          Demande de
                          {" "}
                          {approval.requester?.name}

                        </h2>

                        <div className="flex items-center gap-2 text-gray-500 mt-2">

                          <Mail className="h-4 w-4" />

                          {approval.requester?.email}

                        </div>

                      </div>

                      <div className="flex gap-3">

                        <Button
                          onClick={() =>
                            handleApprove(
                              approval.id
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 rounded-2xl"
                        >

                          <CheckCircle2 className="h-4 w-4 mr-2" />

                          Approuver

                        </Button>

                        <Button
                          variant="destructive"
                          className="rounded-2xl"
                          onClick={() =>
                            handleReject(
                              approval.id
                            )
                          }
                        >

                          <XCircle className="h-4 w-4 mr-2" />

                          Rejeter

                        </Button>

                      </div>

                    </div>

                  </div>

                  {/* CONTENT */}
                  <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-8">

             
                    {/* AFTER */}
                    <div className="bg-green-50 border border-green-100 rounded-3xl p-6">

                      <div className="flex items-center gap-3 mb-6">

                        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">

                          <Sparkles className="h-6 w-6 text-green-600" />

                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-green-700">

                            Nouvelles données

                          </h3>

                        </div>

                      </div>

                      <div className="space-y-4">

                        <InfoRow
                          label="Nom"
                          value={data.name}
                        />

                        <InfoRow
                          label="Email"
                          value={data.email}
                        />

                        <InfoRow
                          label="Rôle"
                          value={getRoleName(
                            data.role_id
                          )}
                        />

                        <InfoRow
                          label="Station"
                          value={getStationName(
                            data.station_id
                          )}
                        />

                        <InfoRow
                          label="Génération"
                          value={getGenerationName(
                            data.generation_id
                          )}
                        />

                      </div>

                    </div>

                  </div>

                 
                </CardContent>

              </Card>

            );
          })}
        </div>
      )}
    </div>
  );
}

// INFO ROW
function InfoRow({ label, value }) {

  return (

    <div className="flex justify-between items-center border-b pb-3">

      <span className="text-gray-500">

        {label}

      </span>

      <span className="font-semibold text-[#111]">

        {value || "N/A"}

      </span>

    </div>
  );
}

// DIFF ROW
function DiffRow({
  label,
  oldValue,
  newValue
}) {

  return (

    <div className="grid grid-cols-3 gap-4 items-center">

      <div className="font-medium text-gray-600">

        {label}

      </div>

      <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl">

        {oldValue || "N/A"}

      </div>

      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl">

        {newValue || "N/A"}

      </div>

    </div>
  );
}