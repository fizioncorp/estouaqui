import { HeartHandshake, LifeBuoy, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { PlatformLimitNotice } from "../components/safety/PlatformLimitNotice";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const steps = [
  "Você conta como está se sentindo",
  "Passa por uma triagem de segurança",
  "Um voluntário aprovado conversa com você",
  "Você encerra quando quiser"
];

export function LandingPage() {
  return (
    <AppShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div className="space-y-8">
          <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-pine ring-1 ring-forest/10">
            apoio humano gratuito
          </div>
          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-forest sm:text-6xl">
              Você não precisa passar por tudo sozinho.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-ink/78">
              Uma rede gratuita de apoio humano para quem precisa conversar,
              desabafar ou ser ouvido com respeito.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/preciso-de-ajuda">
              <Button className="w-full sm:w-auto">Preciso conversar</Button>
            </Link>
            <Link to="/voluntarios/aplicar">
              <Button variant="secondary" className="w-full sm:w-auto">
                Quero ser voluntário
              </Button>
            </Link>
          </div>
          <PlatformLimitNotice />
        </div>

        <Card className="relative overflow-hidden bg-forest text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-7 w-7" />
              <p className="text-lg font-semibold">Somos uma ponte de acolhimento humano.</p>
            </div>
            <p className="text-sm leading-7 text-white/82">
              Não somos serviço de emergência, terapia ou atendimento médico. Somos
              um espaço seguro para escuta, acolhimento e orientação básica de
              segurança.
            </p>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-3xl bg-white/8 px-4 py-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-forest">
                    {index + 1}
                  </div>
                  <p className="text-sm text-white/90">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-3">
        <Card>
          <LifeBuoy className="mb-4 h-7 w-7 text-pine" />
          <h2 className="mb-3 text-xl font-semibold text-forest">Para quem precisa conversar</h2>
          <p className="text-sm leading-7 text-ink/75">
            Pessoas ansiosas, tristes, solitárias ou sobrecarregadas podem pedir
            apoio e falar com um voluntário aprovado.
          </p>
        </Card>
        <Card>
          <HeartHandshake className="mb-4 h-7 w-7 text-pine" />
          <h2 className="mb-3 text-xl font-semibold text-forest">Para voluntários</h2>
          <p className="text-sm leading-7 text-ink/75">
            Se você deseja ajudar gratuitamente, pode se cadastrar, passar pelo
            treinamento e aguardar aprovação.
          </p>
        </Card>
        <Card>
          <Shield className="mb-4 h-7 w-7 text-pine" />
          <h2 className="mb-3 text-xl font-semibold text-forest">Segurança primeiro</h2>
          <p className="text-sm leading-7 text-ink/75">
            Privacidade, respeito e proteção vêm antes de qualquer conversa. Em
            emergência, orientamos busca imediata por ajuda profissional.
          </p>
        </Card>
      </section>
    </AppShell>
  );
}
