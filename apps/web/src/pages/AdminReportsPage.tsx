import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { adminService } from "../services/adminService";

export function AdminReportsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  async function load() {
    const [reportedConversations, safetyEvents] = await Promise.all([
      adminService.reportedConversations(),
      adminService.safetyEvents()
    ]);
    setConversations(reportedConversations);
    setEvents(safetyEvents);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-16 sm:px-6">
        <Card className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-forest">Denúncias</h1>
            <p className="text-sm leading-7 text-ink/75">
              Veja denúncias, mensagens da conversa denunciada e marque como resolvida quando necessário.
            </p>
          </div>
          {conversations.length ? (
            conversations.map((conversation) => (
              <div key={conversation.id} className="rounded-3xl bg-mist/70 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-forest">
                      Usuário: {conversation.user.displayName || conversation.user.name}
                    </p>
                    <p className="text-sm text-ink/70">
                      Voluntário: {conversation.volunteer?.displayName || conversation.volunteer?.name || "Não definido"}
                    </p>
                  </div>
                  <Badge tone="danger">{conversation.status}</Badge>
                </div>
                <div className="mb-4 space-y-2">
                  {conversation.reports.map((report: any) => (
                    <Alert key={report.id} tone="danger">
                      <p className="font-semibold">{report.reason}</p>
                      <p>{report.description || "Sem descrição adicional."}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em]">{report.status}</p>
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          onClick={async () => {
                            await adminService.updateReportStatus(report.id, "RESOLVED");
                            await load();
                          }}
                        >
                          Marcar como resolvida
                        </Button>
                      </div>
                    </Alert>
                  ))}
                </div>
                <div className="rounded-3xl bg-white p-4">
                  <p className="mb-3 text-sm font-semibold text-forest">Mensagens da conversa</p>
                  <div className="space-y-2 text-sm text-ink/75">
                    {conversation.messages.map((message: any) => (
                      <p key={message.id}>
                        <strong>{message.sender.displayName || message.sender.name}:</strong>{" "}
                        {message.content}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Alert tone="success">Nenhuma conversa denunciada no momento.</Alert>
          )}
        </Card>

        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold text-forest">Eventos de segurança</h2>
          {events.length ? (
            events.map((event) => (
              <div key={event.id} className="rounded-3xl bg-mint/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-forest">{event.type}</p>
                  <Badge tone="warning">{new Date(event.createdAt).toLocaleString("pt-BR")}</Badge>
                </div>
                <p className="text-sm leading-7 text-ink/75">
                  {event.description || "Sem descrição detalhada."}
                </p>
              </div>
            ))
          ) : (
            <Alert tone="success">Nenhum evento de segurança registrado.</Alert>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
