import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <Card className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold text-forest">Página não encontrada</h1>
          <p className="text-sm leading-7 text-ink/75">
            O caminho que você tentou abrir não existe ou foi movido.
          </p>
          <Link to="/">
            <Button>Voltar para a página inicial</Button>
          </Link>
        </Card>
      </div>
    </AppShell>
  );
}
