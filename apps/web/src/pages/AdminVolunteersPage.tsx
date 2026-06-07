import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { adminService } from "../services/adminService";

export function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);

  async function load() {
    const data = await adminService.volunteers();
    setVolunteers(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Card className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-forest">Voluntários</h1>
            <p className="text-sm leading-7 text-ink/75">
              Analise motivação, treinamento e histórico antes de aprovar.
            </p>
          </div>
          <div className="space-y-4">
            {volunteers.map((volunteer) => (
              <div key={volunteer.id} className="rounded-3xl bg-mist/70 p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-forest">{volunteer.user.name}</p>
                    <p className="text-sm text-ink/70">{volunteer.user.email}</p>
                  </div>
                  <Badge
                    tone={
                      volunteer.status === "APPROVED"
                        ? "success"
                        : volunteer.status === "PENDING"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {volunteer.status}
                  </Badge>
                </div>
                <p className="mb-3 text-sm leading-7 text-ink/75">{volunteer.motivation}</p>
                <p className="mb-4 text-sm text-ink/65">
                  Treinamento: {volunteer.trainingCompleted ? "concluído" : "pendente"}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={async () => {
                    await adminService.approveVolunteer(volunteer.id);
                    await load();
                  }}>
                    Aprovar
                  </Button>
                  <Button variant="ghost" onClick={async () => {
                    await adminService.rejectVolunteer(volunteer.id, "Perfil não aderente neste momento.");
                    await load();
                  }}>
                    Rejeitar
                  </Button>
                  <Button variant="danger" onClick={async () => {
                    await adminService.blockVolunteer(volunteer.id, "Conduta incompatível com as regras da plataforma.");
                    await load();
                  }}>
                    Bloquear
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
