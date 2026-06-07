import { AppShell } from "../components/layout/AppShell";
import { EmergencyNotice } from "../components/safety/EmergencyNotice";
import { PlatformLimitNotice } from "../components/safety/PlatformLimitNotice";
import { Card } from "../components/ui/Card";

export function SafetyPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-16 sm:px-6">
        <Card className="space-y-4">
          <h1 className="text-3xl font-semibold text-forest">Segurança da plataforma</h1>
          <PlatformLimitNotice />
          <p className="text-sm leading-7 text-ink/75">
            Esta plataforma coleta o mínimo necessário, registra eventos de segurança,
            possui denúncia, autenticação, rate limit e bloqueia compartilhamento de
            telefone, e-mail e links externos no chat do MVP.
          </p>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold text-forest">Emergências</h2>
          <EmergencyNotice />
        </Card>
      </div>
    </AppShell>
  );
}
