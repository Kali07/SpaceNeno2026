import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGIN_BG, LOGO_NAME, LOGO} from "@/data/mockData";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      localStorage.setItem(
        "change_password",
        result.change_password ? "true" : "false"
      );

      navigate(
        result.change_password ? "/updating" : "/dashboard"
      );
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-white flex"
      data-testid="login-page"
    >

{/* ===================================== */}
{/* SECTION GAUCHE */}
{/* ===================================== */}

<div className="hidden lg:flex lg:w-[48%] relative overflow-hidden border-r border-slate-200">

  {/* Fond très léger */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `url(${LOGIN_BG})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      opacity: 0.04,
    }}
  />

  {/* Dégradé */}
  <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FCFCFD] to-[#F4F7FB]" />

  <div className="relative z-10 flex flex-col justify-between h-full px-10 xl:px-12 py-10">

    {/* Header */}
    <div className="flex items-center justify-between">

      <img
        src={LOGO_NAME}
        alt="Neno Space"
        className="w-40 object-contain"
      />

      <div className="px-4 py-2 rounded-full bg-[#FFF8E6] border border-[#D4AF37]/30">
        <span className="text-[#B8860B] text-sm font-semibold">
          Jubilé d'Or • 1976 - 2026
        </span>
      </div>

    </div>

    {/* Centre */}
    <div className="flex flex-col items-center text-center">

      {/* Logo Cinquantenaire */}
      <img
        src={LOGIN_BG}
        alt="Cinquantenaire EUJC"
        className="
          w-[320px]
          xl:w-[360px]
          max-w-full
          object-contain
          drop-shadow-lg
          mb-8
        "
      />

      <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
        Plateforme officielle de gestion et de suivi des membres
        de l'Église Universelle de Jésus-Christ.
      </p>
      
      <div className="w-full max-w-md mt-8">

        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-5" />

        <p className="italic text-[#102A43] text-base">
          « Ensemble, bâtissons une communauté forte,
          unie et engagée pour Christ. »
        </p>

      </div>

    </div>

    {/* Footer */}
    <div className="flex items-center justify-between text-sm">

      <span className="text-slate-500">
        NENO SPACE • Version 1.0
      </span>

      <span className="font-medium text-[#B8860B]">
        Eglise Universelle de Jésus-Christ
         </span>

            </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* SECTION DROITE */}
      {/* ===================================== */}

      <div className="w-full lg:w-[42%] flex items-center justify-center bg-white border-l border-slate-200">
        <div className="w-full max-w-md px-8">
          {/* Mobile uniquement */}
          <div className="lg:hidden text-center mb-10">
            <img
              src={LOGO_NAME}
              alt="Neno Space"
              className="w-44 mx-auto"
            />
          </div>

          {/* Logo desktop */}
          <div className="hidden lg:block mb-10">
            <img
              src={LOGO_NAME}
              alt="Neno Space"
              className="w-36"
            />
          </div>

          {/* Titre */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-[#102A43] mb-3">
              Bienvenue
            </h2>

            <p className="text-slate-500 leading-relaxed">
              Connectez-vous pour accéder à votre espace
              personnel et poursuivre votre parcours.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className="mb-2 block font-medium text-[#102A43]"
              >
                Adresse Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="mb-2 block font-medium text-[#102A43]"
              >
                Mot de passe
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#1D4ED8] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-12
                rounded-xl
                bg-[#0F4C81]
                hover:bg-[#0D426E]
                text-white
                font-semibold
              "
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Connexion..."
                : "Se connecter"}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400">
              NENO SPACE • Plateforme officielle de l'EUJC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}