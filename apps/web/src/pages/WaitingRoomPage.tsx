import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { breathingSteps } from "../constants/emergency";
import { waitingText } from "../constants/texts";
import { useSocket } from "../hooks/useSocket";
import type { SupportRequest } from "../types/support";
import { api } from "../services/api";
import { supportService } from "../services/supportService";

export function WaitingRoomPage() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeRequest = useMemo(
    () => requests.find((item) => item.status === "ACTIVE" || item.status === "WAITING"),
    [requests]
  );

  async function load() {
    const data = await supportService.getMySupportRequests();
    setRequests(data);
    setIsLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    socket?.on("support_request_accepted", ({ conversationId }) => {
      navigate(`/chat/${conversationId}`);
    });

    return () => {
      socket?.off("support_request_accepted");
    };
  }, [navigate, socket]);

  useEffect(() => {
    if (activeRequest?.conversation?.id) {
      navigate(`/chat/${activeRequest.conversation.id}`);
    }
  }, [activeRequest, navigate]);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <Card className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-forest">Sala de espera</h1>
            <p className="text-sm leading-7 text-ink/75">{waitingText}</p>
          </div>

          {isLoading ? <Spinner /> : null}

          {activeRequest ? (
            <>
              <Alert>
                Estamos procurando um voluntário disponível. Enquanto isso, respire.
                Você está em um lugar seguro dentro da plataforma.
              </Alert>
              <div className="rounded-3xl bg-mint/70 p-5">
                <p className="mb-3 text-sm font-semibold text-forest">Protocolo rápido</p>
                <ul className="space-y-2 text-sm text-ink/80">
                  {breathingSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              <Button
                variant="ghost"
                onClick={async () => {
                  await api.post(`/support/requests/${activeRequest.id}/cancel`);
                  await load();
                }}
              >
                Cancelar pedido em espera
              </Button>
            </>
          ) : (
            <Alert tone="success">
              Você ainda não possui um pedido em espera. Se quiser, faça um novo check-in.
            </Alert>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
