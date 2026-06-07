import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";

export function EmergencyTriageForm({
  onChoose
}: {
  onChoose: (isEmergency: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <Alert>
        Antes de continuar, precisamos saber se você está em segurança.
      </Alert>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-forest">
          Você está pensando em se machucar, machucar alguém ou está em perigo imediato?
        </h2>
        <p className="text-sm leading-6 text-ink/75">
          Em situações graves, o app não deve parecer capaz de lidar sozinho com a emergência.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="danger" fullWidth onClick={() => onChoose(true)}>
          Sim, preciso de ajuda urgente
        </Button>
        <Button variant="secondary" fullWidth onClick={() => onChoose(false)}>
          Não, quero conversar
        </Button>
      </div>
    </div>
  );
}
