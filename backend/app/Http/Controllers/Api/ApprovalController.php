<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Approval;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\ApprovalService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ApprovalController extends Controller
{
    use AuthorizesRequests;
    // 🔹 voir toutes les demandes
    public function index()
    {
        return Approval::with('requester')->where('status', 'pending')->get();
    }

    // 🔹 voir uniquement les pending
    public function pending()
    {
        return Approval::where('status', 'pending')
            ->with('requester')
            ->get();
    }

    // 🔹 approuver
   
        public function approve($id)// function approve pour approuver une demande d'approbation spécifique
        {
            $approval = Approval::findOrFail($id);// récupère la demande d'approbation ciblée
            $user = Auth::user();
        
            // Auth check
            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
        
            //  Vérifie déjà traité
            if ($approval->status !== 'pending') {
                return response()->json(['error' => 'Already processed'], 400);
            }
        
            //  Authorization via policy
            $this->authorize('approve', $approval);// vérifie si l'utilisateur actuel est autorisé à approuver la demande d'approbation en utilisant la méthode authorize du trait AuthorizesRequests, qui utilise la méthode approve de la ApprovalPolicy pour vérifier la hiérarchie des rôles entre l'utilisateur actuel et le demandeur de la demande d'approbation
        
            DB::beginTransaction();// commence une transaction de base de données pour garantir que toutes les opérations liées à l'approbation sont atomiques (c'est-à-dire qu'elles réussissent ou échouent ensemble)
        
            try {// essaye d'exécuter le code d'approbation et de mise à jour de la demande d'approbation, et capture toute exception qui pourrait survenir pendant ce processus
                // logique métier
                app(ApprovalService::class)->handle($approval);// appelle la méthode handle du ApprovalService pour exécuter l'action associée à la demande d'approbation (par exemple, créer un nouvel utilisateur), en passant la demande d'approbation ciblée comme argument
        
                //  update approval
                $approval->update([
                    'status' => 'approved',
                    'approved_by' => $user->id
                ]);
        
                DB::commit();// valide la transaction de base de données, ce qui signifie que toutes les opérations liées à l'approbation sont enregistrées de manière permanente dans la base de données
        
                return response()->json([
                    'message' => 'Approved'
                ]);
        
            } catch (\Exception $e) {
        
                DB::rollBack();// annule la transaction de base de données, ce qui signifie que toutes les opérations liées à l'approbation sont annulées et que la base de données revient à son état précédent en cas d'erreur pendant le processus d'approbation
        
                Log::error($e); //enregistre l'erreur dans les logs de l'application, ce qui est important pour le débogage et la surveillance en production
        
                return response()->json([
                    'error' => $e->getMessage(),// à supprimer en prod pour éviter de divulguer des informations sensibles sur l'erreur
                    'line' => $e->getLine(),
                    'file' => $e->getFile()
                ], 500);
            }
        }



    public function reject($id)// function reject pour refuser une demande d'approbation spécifique
    {
        $approval = Approval::findOrFail($id);// récupère la demande d'approbation ciblée
        $user = Auth::user();
    
        // Auth check
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    
        //  Vérifie déjà traité
        if ($approval->status !== 'pending') {
            return response()->json(['error' => 'Already processed'], 400);
        }
    
        //  Authorization via policy
        $this->authorize('reject', $approval);// vérifie si l'utilisateur actuel est autorisé à refuser la demande d'approbation en utilisant la méthode authorize du trait AuthorizesRequests, qui utilise la méthode reject de la ApprovalPolicy pour vérifier la hiérarchie des rôles entre l'utilisateur actuel et le demandeur de la demande d'approbation
    
        DB::beginTransaction();// commence une transaction de base de données pour garantir que toutes les opérations liées au refus de l'approbation sont atomiques (c'est-à-dire qu'elles réussissent ou échouent ensemble)
    
        try {// essaye d'exécuter le code de refus et de mise à jour de la demande d'approbation, et capture toute exception qui pourrait survenir pendant ce processus
            // logique métier
            //app(ApprovalService::class)->handle($approval);
    
            //  update approval
            $approval->update([
                'status' => 'rejected',
                'approved_by' => $user->id
            ]);
    
            DB::commit();// valide la transaction de base de données, ce qui signifie que toutes les opérations liées au refus de l'approbation sont enregistrées de manière permanente dans la base de données
    
            return response()->json([
                'message' => 'Rejected'
            ]);
    
        } catch (\Exception $e) {
    
            DB::rollBack();// annule la transaction de base de données, ce qui signifie que toutes les opérations liées au refus de l'approbation sont annulées et que la base de données revient à son état précédent en cas d'erreur pendant le processus de refus
    
            Log::error($e); //enregistre l'erreur dans les logs de l'application, ce qui est important pour le débogage et la surveillance en production
    
            return response()->json([
                'error' => $e->getMessage(),// à supprimer en prod pour éviter de divulguer des informations sensibles sur l'erreur
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

}
