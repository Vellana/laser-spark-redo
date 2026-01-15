import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load pages for optimized bundle splitting
const Index = lazy(() => import("./pages/Index"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Specials = lazy(() => import("./pages/Specials"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const LaserHairRemoval = lazy(() => import("./pages/LaserHairRemoval"));
const LaserSkinResurfacing = lazy(() => import("./pages/LaserSkinResurfacing"));
const CoolPeelTysons = lazy(() => import("./pages/CoolPeelTysons"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal loading fallback with fade transition
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <div className="animate-fade-in">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/specials" element={<Specials />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/laser-hair-removal" element={<LaserHairRemoval />} />
              <Route path="/laser-skin-resurfacing" element={<LaserSkinResurfacing />} />
              <Route path="/coolpeel-co2-laser-tysons-va" element={<CoolPeelTysons />} />
              {/* Redirect old CoolPeel URL to the SEO-optimized one */}
              <Route path="/services/coolpeel" element={<Navigate to="/coolpeel-co2-laser-tysons-va" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;