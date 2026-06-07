import { Alert } from "../ui/Alert";
import { emergencyContacts } from "../../constants/emergency";

export function EmergencyNotice() {
  return (
    <Alert tone="danger">
      <p className="mb-3 font-semibold">Se você está em risco imediato, procure ajuda agora.</p>
      <ul className="space-y-1">
        {emergencyContacts.map((contact) => (
          <li key={contact.label}>
            {contact.label}: {contact.value}
          </li>
        ))}
      </ul>
    </Alert>
  );
}
