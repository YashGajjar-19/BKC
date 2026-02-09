import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Overview from "./features/dashboard/Overview";
import Missions from "./features/dashboard/Missions";
import CommChannel from "./features/dashboard/Chat/CommChannel";
import Team from "./features/dashboard/Team";
import Settings from "./features/dashboard/Settings";
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicLayout from "./components/layouts/PublicLayout";

export default function App ()
{
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */ }
          <Route path="/" element={ <Home /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/profile/:id" element={ <Profile /> } />

          {/* Chat Route (Protected, Standalone with Global Header) */}
          <Route path="/chat" element={
            <ProtectedRoute>
                <CommChannel />
            </ProtectedRoute>
          } />

          {/* Dashboard Routes with Nested Routing */ }
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route index element={ <Overview /> } />
                  <Route path="missions" element={ <Missions /> } />
                  <Route path="team" element={ <Team /> } />
                  <Route path="settings" element={ <Settings /> } />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}