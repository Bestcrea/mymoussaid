import { Routes, Route, Navigate } from "react-router-dom";
import type { UserRole } from "@/shared";
import { useAuthStore } from "./store/authStore";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { HomePage } from "./pages/public/HomePage";
import { ServicesPage } from "./pages/public/ServicesPage";
import { ContactPage } from "./pages/public/ContactPage";
import { AboutPage } from "./pages/public/AboutPage";
import { PrivacyPage } from "./pages/public/PrivacyPage";
import { ManagerPage } from "./pages/public/roles/ManagerPage";
import { IntervenantPage } from "./pages/public/roles/IntervenantPage";
import { SecretairePage } from "./pages/public/roles/SecretairePage";
import { ChefProjetPage } from "./pages/public/roles/ChefProjetPage";
import { PartenairePage } from "./pages/public/roles/PartenairePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RegisterSuccessPage } from "./pages/RegisterSuccessPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { BidsPage } from "./pages/BidsPage";
import { BidDetailPage } from "./pages/BidDetailPage";
import { MessagesPage } from "./pages/MessagesPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";

function RequireAuth({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: UserRole;
}) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/roles/manager" element={<ManagerPage />} />
        <Route path="/roles/intervenant" element={<IntervenantPage />} />
        <Route path="/roles/secretaire" element={<SecretairePage />} />
        <Route path="/roles/chef-projet" element={<ChefProjetPage />} />
        <Route path="/roles/partenaire" element={<PartenairePage />} />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/success" element={<RegisterSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/:id/documents" element={<DocumentsPage />} />
        <Route path="/projects/:id/bids" element={<BidsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/bids" element={<BidsPage />} />
        <Route path="/bids/:id" element={<BidDetailPage />} />
        <Route path="/offers" element={<BidsPage />} />
        <Route path="/profile" element={<DashboardPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route
          path="/admin/users"
          element={
            <RequireAuth role="ADMIN">
              <AdminUsersPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}
