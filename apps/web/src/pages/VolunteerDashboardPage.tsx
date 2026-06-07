import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import type { VolunteerDashboardData } from "../types/volunteer";
import { volunteerService } from "../services/volunteerService";

export function VolunteerDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<VolunteerDashboardData | null>(null);

  async function load() {
    const result = await volunteerService.dashboard();
    setData(result);
  }

  useEffect(() => {
    load();
  }, []);

  const profile = data?.profile;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-4">
            <h1 className="text-3xl font-semibold text-forest">Dashboard do voluntário</h1>
            {profile ? (
              <>
                <Badge
                  tone={
                    profile.status === "APPROVED"
                      ? "success"
                      : profile.status === "PENDING"
                        ? "warning"
                        : "danger"
                  }
                >
                  {profile.status}
                </Badge>
                <p className="text-sm leading-7 text-ink/75">
                  Seu papel é ouvir, acolher e respeitar. Não dê diagnóstico, não
                  prometa cura, não peça dados pessoais e não leve a conversa para fora da plataforma.
                </p>
                <ul className="space-y-2 text-sm text-ink/78">
                  {data?.quickRules.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
                {!profile.trainingCompleted && (
                  <Button fullWidth onClick={() => navigate("/voluntarios/treinamento")}>
                    Ir para treinamento
                  </Button>
                )}
                {data?.activeConversation && (
                  <Button
                    fullWidth
                    onClick={() => navigate(`/chat/${data.activeConversation?.id}`)}
                  >
                    Retomar conversa ativa
                  </Button>
                )}
              </>
            ) : (
              <Alert>Você ainda não concluiu sua candidatura.</Alert>
            )}
          </Card>

          <Card className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-forest">Pedidos aguardando</h2>
              <p className="text-sm leading-7 text-ink/75">
                Voluntários aprovados podem aceitar um pedido de cada vez no MVP.
              </p>
            </div>

            {profile?.status !== "APPROVED" || !profile.trainingCompleted ? (
              <Alert>
                Você precisa concluir o treinamento e aguardar aprovação para atender usuários.
              </Alert>
            ) : data?.waitingRequests.length ? (
              data.waitingRequests.map((request) => (
                <div key={request.id} className="rounded-3xl bg-mist/70 p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-forest">
                        {request.user.displayName || "Pessoa anônima"}
                      </p>
                      <p className="text-xs uppercase tracking-[0.22em] text-pine">
                        {request.category} • {request.urgency}
                      </p>
                    </div>
                    <Badge tone="warning">{request.status}</Badge>
                  </div>
                  <p className="mb-4 text-sm leading-7 text-ink/75">
                    {request.initialMessage || "Sem mensagem inicial."}
                  </p>
                  <Button
                    onClick={async () => {
                      const conversation = await volunteerService.acceptRequest(request.id);
                      navigate(`/chat/${conversation.id}`);
                    }}
                  >
                    Aceitar pedido
                  </Button>
                </div>
              ))
            ) : (
              <Alert tone="success">Nenhum pedido aguardando no momento.</Alert>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
