import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LOGIN_BG } from '@/data/mockData';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };*/


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError('');
    setLoading(true);
  
    const result = await login(email, password);
  
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  
    setLoading(false);
  };


  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2" data-testid="login-page">
      {/* Left - Branding */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
          backgroundImage: `url(${LOGIN_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#0066CC]/80" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg font-heading">N</span>
            </div>
            <span className="text-xl font-bold text-white font-heading tracking-tight">NENO SPACE EUJC</span>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-heading tracking-tight leading-tight">
            Bâtir et Structurer <br />La communauté
          </h1>
          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            Une plateforme dédiée pour structurer, suivre et accompagner chaque membre au sein de L'église universelle de Jesus Christ.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-white/50 text-sm">NENO SPACE v1.0</p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#0066CC] flex items-center justify-center">
              <span className="text-white font-bold text-base font-heading">N</span>
            </div>
            <span className="text-lg font-bold tracking-tight font-heading text-[#333333]">NENO SPACE</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight font-heading text-[#333333]">Bienvenu dans votre Espace </h2>
            <p className="text-sm text-[#666666]">Entrez vos identifians pour accéder à l'espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg" data-testid="login-error">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#333333] font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@nenospace.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-[#F5F5F5] border-gray-200 focus:border-[#0066CC] focus:ring-[#0066CC]"
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#333333] font-medium">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez le mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-[#F5F5F5] border-gray-200 pr-10 focus:border-[#0066CC] focus:ring-[#0066CC]"
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#333333]"
                  data-testid="toggle-password-btn"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-[#0066CC] hover:text-[#0055AA] font-medium transition-colors"
                data-testid="forgot-password-link"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0066CC] hover:bg-[#0055AA] text-white font-semibold rounded-lg transition-all duration-200"
              data-testid="login-submit-btn"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? 'Connexion...' : 'Connexion'}
            </Button>
          </form>

          <p className="text-center text-xs text-[#666666]">
            Demo credentials: admin@nenospace.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
