
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import StudentDashboard from "./pages/Student/StudentDashboard";
import NewRequestPage from "./pages/Student/NewRequestPage";
import RequestDetailsPage from "./pages/Student/RequestDetailsPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRequestDetailsPage from "./pages/Admin/RequestDetailsPage";
import SecurityCheckpoint from "./pages/Security/SecurityCheckpoint";
import ProfilePage from "./pages/Profile/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/new-request" element={<NewRequestPage />} />
            <Route path="/student/request/:id" element={<RequestDetailsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/request/:id" element={<AdminRequestDetailsPage />} />
            
            {/* Security Routes */}
            <Route path="/security/check" element={<SecurityCheckpoint />} />
            
            {/* Common Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
