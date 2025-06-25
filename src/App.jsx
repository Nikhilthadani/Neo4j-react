import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToasterProvider } from "./contexts/ToasterContext";

import LoginPage from "./pages/auth/login/LoginPage";
import ForgotPassword from "./pages/auth/forgot/ForgotPassword";
import VerifyOtp from "./pages/auth/otp/VerifyOtp";
import SignupPage from "./pages/auth/signup/SignupPage";
import CreateNewPassword from "./pages/auth/password/CreateNewPassword";

import DashboardPage from "./pages/dashboard/DashboardPage";
import RepositoriesPage from "./pages/repositories/RepositoriesPage";
import IntegrationPage from "./pages/integrations/IntegrationPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ListPage from "./pages/repositories/ListPage";
import SecretPage from "./pages/repositories/SecretPage";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";

import IntegrationGCPPage from "./pages/integrations/GCPPage";
import IntegrationGithubPage from "./pages/integrations/GithubPage";

import Layout from "./components/Layout/Layout";

import AuthCallback from "./components/wait/AuthCallback";
import Risk from "./pages/dashboard/RiskPage";
import IntegrationAzurePage from "./pages/integrations/AzurePage";
import IntegrationAWSPage from "./pages/integrations/AwsPage";
import TokenVisual from "./pages/blast-radius/TokenVisual";
import Neo4jVisual from "./pages/blast-radius/TokenVisual";
function App() {
  return (
    <ToasterProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/repositories" element={<RepositoriesPage />} />
          <Route path="/repositories/:repoId" element={<ListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route
            path="/repositories/:repoId/secrets/:secretId"
            element={<TokenVisual />}
          />
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />

            <Route
              path="/create-new-password"
              element={<CreateNewPassword />}
            />
            <Route path="/auth" element={<AuthCallback />} />
          </Route>
          <Route path="/token" element={<Neo4jVisual />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/repositories" element={<RepositoriesPage />} />
            <Route path="/repositories/:repoId" element={<ListPage />} />

            <Route path="/integration/" element={<IntegrationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/repositories/list" element={<ListPage />} />
            <Route path="/repositories/secret" element={<SecretPage />} />
            <Route path="/integration/" element={<IntegrationPage />} />
            <Route path="/integration/aws" element={<IntegrationAWSPage />} />
            <Route path="/integration/gcp" element={<IntegrationGCPPage />} />
            <Route
              path="/integration/azure"
              element={<IntegrationAzurePage />}
            />
            <Route
              path="/integration/github"
              element={<IntegrationGithubPage />}
            />
            <Route path="/risk" element={<Risk />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToasterProvider>
  );
}

export default App;
