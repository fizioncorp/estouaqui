import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { EmergencyTriageForm } from "../components/forms/EmergencyTriageForm";
import { Card } from "../components/ui/Card";
import { supportService } from "../services/supportService";

export function NeedHelpPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card>
          <EmergencyTriageForm
            onChoose={async (isEmergency) => {
              await supportService.triage({ isEmergency });
              navigate(isEmergency ? "/emergencia" : "/checkin-emocional");
            }}
          />
        </Card>
      </div>
    </AppShell>
  );
}
