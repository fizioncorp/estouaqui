import { AppShell } from "../components/layout/AppShell";
import { EmergencyNotice } from "../components/safety/EmergencyNotice";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { breathingSteps } from "../constants/emergency";

export function EmergencyScreenPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card className="space-y-6 border border-danger/10">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold text-danger">Procure ajuda agora</h1>
            <p className="text-sm leading-7 text-ink/75">
              Se você está em risco imediato, ligue para um serviço de emergência ou
              procure o pronto atendimento mais próximo.
            </p>
          </div>

          <EmergencyNotice />

          <div className="rounded-3xl bg-mist p-5">
            <p className="mb-3 text-sm font-semibold text-forest">
              Ver mensagens de respiração enquanto busca ajuda
            </p>
            <ul className="space-y-2 text-sm text-ink/80">
              {breathingSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <Button variant="ghost">Entendi</Button>
        </Card>
      </div>
    </AppShell>
  );
}
