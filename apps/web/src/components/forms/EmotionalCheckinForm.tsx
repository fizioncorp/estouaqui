import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

type FormValues = {
  mood: number;
  anxiety: number;
  loneliness: number;
  sadness: number;
  stress: number;
  note?: string;
  wantsHumanSupport: boolean;
};

export function EmotionalCheckinForm({
  onSubmit,
  isSubmitting
}: {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
}) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      mood: 3,
      anxiety: 3,
      loneliness: 3,
      sadness: 3,
      stress: 3,
      wantsHumanSupport: true
    }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {[
        ["mood", "Como está seu humor de 1 a 5?"],
        ["anxiety", "Nível de ansiedade de 1 a 5"],
        ["loneliness", "Nível de solidão de 1 a 5"],
        ["sadness", "Nível de tristeza de 1 a 5"],
        ["stress", "Nível de estresse de 1 a 5"]
      ].map(([field, label]) => (
        <label key={field} className="block space-y-2 text-sm font-medium text-ink">
          <span>{label}</span>
          <Input type="number" min={1} max={5} {...register(field as keyof FormValues, { valueAsNumber: true })} />
        </label>
      ))}

      <label className="block space-y-2 text-sm font-medium text-ink">
        <span>Quer escrever algo sobre o que aconteceu?</span>
        <Textarea {...register("note")} />
      </label>

      <label className="flex items-start gap-3 rounded-2xl bg-mint/60 p-4 text-sm text-ink">
        <input type="checkbox" className="mt-1" {...register("wantsHumanSupport")} />
        Quero seguir para um pedido de apoio humano.
      </label>

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Salvar check-in"}
      </Button>
    </form>
  );
}
