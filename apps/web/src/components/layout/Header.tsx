import { HeartHandshake, LifeBuoy, ShieldCheck } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-forest/8 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 text-forest">
          <div className="rounded-2xl bg-mint p-2">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-pine">
              Estou Aqui
            </div>
            <div className="text-xs text-ink/70">apoio humano gratuito</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <NavLink to="/seguranca" className="text-sm text-ink/80 hover:text-forest">
            Segurança
          </NavLink>
          <NavLink to="/termos" className="text-sm text-ink/80 hover:text-forest">
            Termos
          </NavLink>
          <NavLink to="/privacidade" className="text-sm text-ink/80 hover:text-forest">
            Privacidade
          </NavLink>
          {user?.role === "VOLUNTEER" && (
            <NavLink to="/voluntarios/dashboard" className="text-sm text-ink/80 hover:text-forest">
              <LifeBuoy className="mr-1 inline h-4 w-4" />
              Voluntariado
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className="text-sm text-ink/80 hover:text-forest">
              <ShieldCheck className="mr-1 inline h-4 w-4" />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-ink/70 sm:block">
                Olá, {user.displayName || user.name}
              </span>
              <Button variant="ghost" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/cadastro">
                <Button>Criar conta</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
