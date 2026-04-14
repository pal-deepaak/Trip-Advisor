import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ItineraryProvider } from "@/context/ItineraryContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import Index from "./pages/Index";
import Hotels from "./pages/Hotels";
import Restaurants from "./pages/Restaurants";
import ThingsToDo from "./pages/ThingsToDo";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ItineraryPlan from "./pages/ItineraryPlan";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ItineraryProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/things-to-do" element={<ThingsToDo />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/itinerary" element={<ItineraryPlan />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <ChatBot />
        </ItineraryProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;