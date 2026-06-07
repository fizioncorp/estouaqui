import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmotionalCheckinForm } from "../components/forms/EmotionalCheckinForm";
import { AppShell } from "../components/layout/AppShell";
import { PlatformLimitNotice } from "../components/safety/PlatformLimitNotice";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import type { SupportCategory, Urgency } from "../types/support";
import { supportService } from "../services/supportService";

const categories: Array<{ label: string; value: SupportCategory }> = [
  { label: "Estou ansioso", value: "ANXIETY" },
  { label: "Estou triste", value: "SADNESS" },
  { label: "Estou sozinho", value: "LONELINESS" },
  { label: "Estou com raiva", value: "ANGER" },
  { label: "Estou de luto", value: "GRIEF" },
  { label: "Estou sobrecarregado", value: "OVERWHELMED" },
  { label: "Só preciso conversar", value: "JUST_TALK" },
  { label: "Outro", value: "OTHER" }
];

export function EmotionalCheckinPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<SupportCategory>("JUST_TALK");
  const [urgency, setUrgency] = useState<Urgency>("MEDIUM");
  const [initialMessage, setInitialMessage] = useState("");

  return (
    <AppShell>
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-forest">Check-in emocional</h1>
            <p className="text-sm leading-7 text-ink/75">
              Vamos entender como você está agora e então criar seu pedido de apoio.
            </p>
          </div>
          {error && <Alert tone="danger">{error}</Alert>}
          <EmotionalCheckinForm
            isSubmitting={isSubmitting}
            onSubmit={async (values) => {
              try {
                setIsSubmitting(true);
                setError("");
                await supportService.createCheckin(values);
              } catch {
                setError("Não foi possível salvar o check-in.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        </Card>

        <Card className="space-y-5">
          <PlatformLimitNotice />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-forest">Categoria do apoio</h2>
            <p className="text-sm leading-7 text-ink/75">
              Escolha o que mais se aproxima do que você sente agora.
            </p>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Categoria</span>
            <Select value={category} onChange={(event) => setCategory(event.target.value as SupportCategory)}>
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Urgência</span>
            <Select value={urgency} onChange={(event) => setUrgency(event.target.value as Urgency)}>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="EMERGENCY">Emergência</option>
            </Select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Quer escrever algo antes do chat?</span>
            <Textarea
              value={initialMessage}
              onChange={(event) => setInitialMessage(event.target.value)}
              placeholder="Conte apenas o necessário. Evite telefone, e-mail, links e dados pessoais."
            />
          </label>
          <Button
            fullWidth
            onClick={async () => {
              try {
                setError("");
                const result = await supportService.createSupportRequest({
                  category,
                  urgency,
                  initialMessage
                });

                if (result.redirectToEmergency) {
                  navigate("/emergencia");
                  return;
                }

                if (result.supportRequest?.conversation?.id) {
                  navigate(`/chat/${result.supportRequest.conversation.id}`);
                  return;
                }

                navigate("/aguardando");
              } catch {
                setError("Não foi possível criar seu pedido de apoio.");
              }
            }}
          >
            Criar pedido de apoio
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
