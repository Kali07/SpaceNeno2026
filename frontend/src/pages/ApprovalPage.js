import { useEffect, useState } from "react";
import { getApprovals, approveRequest, rejectRequest } from "../api/approvalApi";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 récupérer les approvals
  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const data = await getApprovals();
      setApprovals(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  // ✅ approuver
  const handleApprove = async (id) => {
    try {
      const data = await approveRequest(id);
      fetchApprovals(); // refresh après action
      console.log("RESPONSE:", data);

      /*if (data.message === "Request submitted for approval") {
        alert("Demande envoyée pour validation par l'administrateur.");*/
        if (data.message === "Approved") {
          alert("Demande approuvée avec succès !");
        return;
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ❌ rejeter

  const handleReject = async(id)=>{
    try{
      const data = await rejectRequest(id);
      fetchApprovals(); // refresh après action
      console.log("RESPONSE:", data);

      if(data.message === "Rejected"){
        alert("Demande rejetée avec succès !");
        return;
      }


    } catch(err){

      alert(err.message);
    }
  };

  // 🎯 UI
  if (loading) {
    return <div style={{ padding: 20 }}>Chargement...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Demandes d'approbation</h1>

      {approvals.length === 0 ? (
        <p>Aucune demande en attente</p>
      ) : (
        approvals.map((approval) => {
          const data = JSON.parse(approval.data);

          return (
            <div
              key={approval.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 15,
                borderRadius: 8,
              }}
            >
              <p><strong>Action :</strong> {approval.action}</p>
              <p><strong>Demandeur :</strong> {approval.requester?.name}</p>
              <p><strong>Nom :</strong> {data.name}</p>
              <p><strong>Email :</strong> {data.email}</p>

              <button
                onClick={() => handleApprove(approval.id)}
                style={{
                  marginTop: 10,
                  marginRight: 20,
                  padding: "6px 12px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Approuver
              </button>

              <button
                onClick={() => handleReject(approval.id)}
                style={{
                  marginTop: 10,
                  padding: "6px 12px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Rejeter
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}