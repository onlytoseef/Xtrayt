
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect } from "react";
import { pageView } from "@/lib/analytics";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Features from "./pages/Features";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import ThumbnailPage from "./pages/features/ThumbnailPage";
import TranscriptPage from "./pages/features/TranscriptPage";
import ThumbnailPreviewPage from "./pages/features/ThumbnailPreviewPage";
import TikTokVideoPage from "./pages/features/TikTokVideoPage";
import YouTubeTagsPage from "./pages/features/YouTubeTagsPage";
import ThumbnailIdeaGeneratorPage from "./pages/features/ThumbnailIdeaGeneratorPage";
import VideoSummarizerPage from "./pages/features/VideoSummarizerPage";
import CategoryPortfolio from "./pages/portfolio/CategoryPortfolio";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';

import { MotionConfig } from "framer-motion";

const queryClient = new QueryClient();

const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    pageView({
      path: location.pathname,
      title: document.title,
      search: location.search
    });
  }, [location]);
  
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="dark" storageKey="ytube-theme">
          <TooltipProvider>
            <MotionConfig reducedMotion="user">
              <AuthProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <RouteTracker />
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/features" element={<Features />} />

                        {/* Features Routes */}
                        <Route path="/features/youtube-tags" element={<YouTubeTagsPage />} />
                        <Route path="/features/thumbnail" element={<ThumbnailPage />} />
                        <Route path="/features/thumbnail-preview" element={<ThumbnailPreviewPage />} />
                        <Route path="/features/thumbnail-idea-generator" element={<ThumbnailIdeaGeneratorPage />} />
                        <Route path="/features/video-summarizer" element={<VideoSummarizerPage />} />
                        <Route path="/features/transcript" element={<TranscriptPage />} />
                        <Route path="/features/tiktok-downloader" element={<TikTokVideoPage />} />

                        {/* Add aliases for backward compatibility */}
                        <Route path="/features/yt-tags" element={<YouTubeTagsPage />} />
                        <Route path="/features/tiktok-video" element={<TikTokVideoPage />} />
                        <Route path="/features/thumbnail-downloader" element={<ThumbnailPage />} />

                        {/* Portfolio Routes */}
                        <Route path="/portfolio/:categoryId" element={<CategoryPortfolio />} />

                        <Route path="/auth/sign-in" element={<SignIn />} />
                        <Route path="/auth/sign-up" element={<SignUp />} />
                        <Route path="/auth/reset-password" element={<ResetPassword />} />

                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        } />

                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <div>Profile Page</div>
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <div>Settings Page</div>
                          </ProtectedRoute>
                        } />

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </BrowserRouter>
              </AuthProvider>
            </MotionConfig>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
