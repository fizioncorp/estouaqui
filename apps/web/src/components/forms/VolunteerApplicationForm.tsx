import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

type FormValues = {
  motivation: string;
  experience?: string;
  availability?: string;
  acceptedVolunteerTerms: boolean;
};

export function VolunteerApplicationForm({
  onSubmit,
  isSubmitting
}: {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
}) {
  const { register, handleSubmit } = useForm<FormValues>();

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">Por que você quer ajudar?</span>
        <Textarea {...register("motivation", { required: true })} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">
          Você já participou de algum projeto social?
        </span>
        <Textarea {...register("experience")} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">
          Quais horários teria disponibilidade?
        </span>
        <Input {...register("availability")} />
      </label>
      <label className="flex gap-3 rounded-2xl bg-mint/60 p-4 text-sm">
        <input type="checkbox" {...register("acceptedVolunteerTerms", { required: true })} />
        Eu entendo que não farei terapia nem diagnóstico e aceito o termo de voluntariado.
      </label>
      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar candidatura"}
      </Button>
    </form>
  );
}
