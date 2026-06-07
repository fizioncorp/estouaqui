import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { NeedHelpPage } from "../pages/NeedHelpPage";
import { EmotionalCheckinPage } from "../pages/EmotionalCheckinPage";
import { EmergencyScreenPage } from "../pages/EmergencyScreenPage";
import { WaitingRoomPage } from "../pages/WaitingRoomPage";
import { ChatPage } from "../pages/ChatPage";
import { VolunteerApplyPage } from "../pages/VolunteerApplyPage";
import { VolunteerTrainingPage } from "../pages/VolunteerTrainingPage";
import { VolunteerDashboardPage } from "../pages/VolunteerDashboardPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminVolunteersPage } from "../pages/AdminVolunteersPage";
import { AdminReportsPage } from "../pages/AdminReportsPage";
import { TermsPage } from "../pages/TermsPage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { SafetyPage } from "../pages/SafetyPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { VolunteerTermsPage } from "../pages/VolunteerTermsPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/seguranca" element={<SafetyPage />} />
        <Route path="/termo-voluntario" element={<VolunteerTermsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/preciso-de-ajuda" element={<NeedHelpPage />} />
          <Route path="/checkin-emocional" element={<EmotionalCheckinPage />} />
          <Route path="/emergencia" element={<EmergencyScreenPage />} />
          <Route path="/aguardando" element={<WaitingRoomPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/voluntarios/aplicar" element={<VolunteerApplyPage />} />

          <Route element={<RoleRoute allowedRoles={["VOLUNTEER"]} />}>
            <Route path="/voluntarios/treinamento" element={<VolunteerTrainingPage />} />
            <Route path="/voluntarios/dashboard" element={<VolunteerDashboardPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/voluntarios" element={<AdminVolunteersPage />} />
            <Route path="/admin/denuncias" element={<AdminReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
