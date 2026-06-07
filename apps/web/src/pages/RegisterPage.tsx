import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

type FormValues = {
  name: string;
  displayName?: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
};

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-forest">Criar conta</h1>
            <p className="text-sm leading-7 text-ink/75">
              Use nome ou apelido. Coletamos o mínimo necessário para proteger a plataforma.
            </p>
          </div>

          {error && <Alert tone="danger">{error}</Alert>}

          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              if (!values.acceptedTerms || !values.acceptedPrivacy) {
                setError("Você precisa aceitar os termos e a política de privacidade.");
                return;
              }

              try {
                setIsSubmitting(true);
                setError("");
                await registerUser({
                  name: values.name,
                  email: values.email,
                  password: values.password,
                  displayName: values.displayName,
                  acceptedTerms: true,
                  acceptedPrivacy: true
                });
                navigate("/preciso-de-ajuda");
              } catch {
                setError("Não foi possível criar sua conta.");
              } finally {
                setIsSubmitting(false);
              }
            })}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-ink">Nome</span>
                <Input {...register("name", { required: true })} />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-ink">Apelido</span>
                <Input {...register("displayName")} />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">E-mail</span>
              <Input type="email" {...register("email", { required: true })} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Senha</span>
              <Input type="password" {...register("password", { required: true })} />
            </label>
            <label className="flex gap-3 rounded-2xl bg-mint/60 p-4 text-sm">
              <input type="checkbox" {...register("acceptedTerms")} />
              Aceito os <Link to="/termos" className="underline">termos de uso</Link>.
            </label>
            <label className="flex gap-3 rounded-2xl bg-sky/50 p-4 text-sm">
              <input type="checkbox" {...register("acceptedPrivacy")} />
              Aceito a <Link to="/privacidade" className="underline">política de privacidade</Link>.
            </label>
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar conta"}
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
