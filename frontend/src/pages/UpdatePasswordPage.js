import { useState } from "react";
import { Lock } from "lucide-react";
import { updatePassword } from "../api/userApi";
import { useMessage } from "../context/MessageContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const { logout } = useAuth();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.new_password !==
      form.new_password_confirmation
    ) {
      showMessage(
        "Les mots de passe ne correspondent pas",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

      if (!passwordRegex.test(form.new_password)) {
        showMessage( "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial", "error" );
       return;
      }

      const result = await updatePassword({
        current_password: form.current_password,
        new_password: form.new_password,
        new_password_confirmation:
          form.new_password_confirmation,
      });

      showMessage(
        result.message ||
          "Mot de passe mis à jour"
      );

         
      localStorage.removeItem("change_password");

      logout();
      
      navigate("/login");;
    } catch (err) {
      showMessage(
        err.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <Lock className="w-7 h-7 text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Changer le mot de passe
            </h1>

            <p className="text-slate-500 text-sm">
              Veuillez définir un nouveau mot
              de passe sécurisé.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Mot de passe actuel
            </label>

            <input
              type="password"
              value={form.current_password}
              onChange={(e) =>
                handleChange(
                  "current_password",
                  e.target.value
                )
              }
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Nouveau mot de passe
            </label>

            <input
              type="password"
              value={form.new_password}
              onChange={(e) =>
                handleChange(
                  "new_password",
                  e.target.value
                )
              }
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Confirmation
            </label>

            <input
              type="password"
              value={
                form.new_password_confirmation
              }
              onChange={(e) =>
                handleChange(
                  "new_password_confirmation",
                  e.target.value
                )
              }
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Mise à jour..."
              : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}