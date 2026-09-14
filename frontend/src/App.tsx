
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SoilAnalysis from "./pages/dashboard/CropPrediction";
import Weather from "./pages/dashboard/Weather";
import CropPrediction from "./pages/dashboard/CropPrediction";
import DiseasePrediction from "./pages/dashboard/DiseasePrediction";
import CropProductionPrediction from "./pages/dashboard/CropProductionPrediction";
import AIAssistant from "./pages/dashboard/AIAssistant";
import Overview from "./pages/dashboard/Overview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="CropPrediction" element={<CropPrediction />} />
          <Route path="DiseasePrediction" element={<DiseasePrediction />} />
          <Route path="CropProductionprediction" element={<CropProductionPrediction />} />
          <Route path="AIAssistant" element={<AIAssistant />} />
          <Route path="Weather" element={<Weather />} />
          </Route>
          {/* Any feature/marketing link that doesn't have its own page yet
              (e.g. /features, /about, /contact, /features/soil-analysis...)
              sends visitors to Sign up / Login instead of a dead-end 404. */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
