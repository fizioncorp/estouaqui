import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { adminService } from "../services/adminService";

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});

  useEffect(() => {
    adminService.dashboard().then(setMetrics);
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link to="/admin/voluntarios">
            <Button variant="secondary">Voluntários</Button>
          </Link>
          <Link to="/admin/denuncias">
            <Button variant="ghost">Denúncias e segurança</Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total de usuários", metrics.totalUsers],
            ["Voluntários pendentes", metrics.pendingVolunteers],
            ["Voluntários aprovados", metrics.approvedVolunteers],
            ["Pedidos aguardando", metrics.waitingRequests],
            ["Conversas ativas", metrics.activeConversations],
            ["Conversas encerradas", metrics.closedConversations],
            ["Denúncias abertas", metrics.openReports],
            ["Eventos de segurança", metrics.safetyEvents]
          ].map(([label, value]) => (
            <Card key={label as string}>
              <p className="mb-3 text-sm text-ink/75">{label}</p>
              <p className="text-4xl font-semibold text-forest">{value || 0}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
