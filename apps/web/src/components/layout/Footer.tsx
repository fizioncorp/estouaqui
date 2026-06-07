import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-forest/8 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink/75 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Você não precisa passar por tudo sozinho. Existem pessoas dispostas a ouvir.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/termos">Termos</Link>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/seguranca">Segurança</Link>
          <a href="mailto:privacidade@seudominio.com">Contato</a>
        </div>
      </div>
    </footer>
  );
}
