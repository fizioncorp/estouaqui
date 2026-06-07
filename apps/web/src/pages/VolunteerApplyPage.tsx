import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VolunteerApplicationForm } from "../components/forms/VolunteerApplicationForm";
import { AppShell } from "../components/layout/AppShell";
import { Alert } from "../components/ui/Alert";
import { Card } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { volunteerService } from "../services/volunteerService";

export function VolunteerApplyPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-forest">Quero ser voluntário</h1>
            <p className="text-sm leading-7 text-ink/75">
              Este projeto é totalmente gratuito. Voluntários não recebem pagamento e
              não podem cobrar, vender serviços ou conduzir pessoas para atendimentos particulares.
            </p>
          </div>
          {!user ? (
            <Alert>
              Para se candidatar, primeiro crie sua conta ou faça login. <Link to="/cadastro" className="underline">Criar conta</Link>.
            </Alert>
          ) : (
            <VolunteerApplicationForm
              isSubmitting={isSubmitting}
              onSubmit={async (values) => {
                try {
                  setIsSubmitting(true);
                  await volunteerService.apply({
                    motivation: values.motivation,
                    experience: values.experience,
                    availability: values.availability,
                    acceptedVolunteerTerms: true
                  });
                  await refreshUser();
                  setMessage("Candidatura enviada. Agora faça o treinamento obrigatório.");
                  navigate("/voluntarios/treinamento");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          )}
          {message && <Alert tone="success">{message}</Alert>}
        </Card>
      </div>
    </AppShell>
  );
}
