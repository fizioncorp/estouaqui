import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { volunteerNotice } from "../constants/texts";
import { volunteerService } from "../services/volunteerService";
import type { TrainingModule } from "../types/volunteer";

const quizQuestions = [
  {
    id: "q1",
    question: "Um usuário diz que está com crise forte e não sabe o que fazer. O voluntário deve:",
    options: [
      { value: "A", label: "Dar diagnóstico" },
      { value: "B", label: "Dizer que é frescura" },
      {
        value: "C",
        label:
          "Acolher, manter linguagem calma e orientar busca de ajuda profissional se houver risco"
      },
      { value: "D", label: "Pedir o WhatsApp pessoal" }
    ],
    correct: "C"
  },
  {
    id: "q2",
    question: "Se a pessoa pedir contato fora da plataforma, o voluntário deve:",
    options: [
      { value: "A", label: "Aceitar para continuar a conversa" },
      { value: "B", label: "Recusar com respeito e manter a conversa no app" },
      { value: "C", label: "Passar o Instagram" }
    ],
    correct: "B"
  },
  {
    id: "q3",
    question: "Ao perceber risco imediato, o voluntário deve:",
    options: [
      { value: "A", label: "Resolver sozinho" },
      { value: "B", label: "Escalar para admin e orientar ajuda profissional" },
      { value: "C", label: "Prometer sigilo absoluto" }
    ],
    correct: "B"
  }
];

export function VolunteerTrainingPage() {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profileStatus, setProfileStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    volunteerService.me().then((data) => {
      setModules(data.trainingModules);
      setProfileStatus(data.profile?.status || "");
    });
  }, []);

  const passed = useMemo(
    () => quizQuestions.every((question) => answers[question.id] === question.correct),
    [answers]
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-forest">Treinamento obrigatório</h1>
              <p className="text-sm leading-7 text-ink/75">{volunteerNotice}</p>
            </div>
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="rounded-3xl bg-mist/70 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine">
                    módulo {module.order}
                  </p>
                  <h2 className="mb-2 text-xl font-semibold text-forest">{module.title}</h2>
                  <p className="text-sm leading-7 text-ink/75">{module.content}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-5">
            <Alert>
              Seu cadastro será analisado. Você será avisado quando for aprovado.
            </Alert>
            <h2 className="text-2xl font-semibold text-forest">Quiz rápido</h2>
            {quizQuestions.map((question) => (
              <label key={question.id} className="block space-y-2">
                <span className="text-sm font-medium leading-6 text-ink">{question.question}</span>
                <Select
                  value={answers[question.id] || ""}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: event.target.value
                    }))
                  }
                >
                  <option value="">Escolha uma resposta</option>
                  {question.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
            ))}

            <Button
              fullWidth
              disabled={!passed}
              onClick={async () => {
                await volunteerService.completeTraining();
                setMessage("Treinamento concluído. Agora aguarde aprovação.");
              }}
            >
              Concluir treinamento
            </Button>

            <Alert tone={passed ? "success" : "info"}>
              {passed
                ? "Quiz aprovado. Você pode concluir o treinamento."
                : "Responda corretamente às perguntas para liberar a conclusão."}
            </Alert>

            {message && <Alert tone="success">{message}</Alert>}
            {profileStatus && <p className="text-sm text-ink/75">Status atual: {profileStatus}</p>}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
