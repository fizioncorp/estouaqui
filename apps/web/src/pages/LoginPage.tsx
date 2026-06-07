import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();

  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <Card className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-forest">Entrar</h1>
            <p className="text-sm leading-7 text-ink/75">
              Acolhimento com respeito, sem promessas de cura e sem substituir ajuda profissional.
            </p>
          </div>

          {error && <Alert tone="danger">{error}</Alert>}

          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                setIsSubmitting(true);
                setError("");
                await login(values.email, values.password);
                navigate(location.state?.from || "/preciso-de-ajuda");
              } catch (err) {
                setError("Não foi possível entrar. Verifique suas credenciais.");
              } finally {
                setIsSubmitting(false);
              }
            })}
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">E-mail</span>
              <Input type="email" {...register("email", { required: true })} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Senha</span>
              <Input type="password" {...register("password", { required: true })} />
            </label>
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-sm text-ink/75">
            Ainda não tem conta? <Link className="text-forest underline" to="/cadastro">Crie sua conta</Link>.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
