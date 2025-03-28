import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import FeaturesTabs from "@/components/features/FeaturesTabs";
import { getFeaturesPageSEO } from "@/utils/seoDataHelper";

const Features = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes("/thumbnail-downloader")) return "thumbnail";
    if (path.includes("/thumbnail")) return "thumbnail";
    if (path.includes("/thumbnail-preview")) return "thumbnail-preview";
    if (path.includes("/thumbnail-idea-generator")) return "thumbnail-idea";
    if (path.includes("/video-summarizer")) return "script-generator";

    if (path.includes("/youtube-tags") || path.includes("/yt-tags"))
      return "yt-tags";
    return "thumbnail";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    switch (value) {
      case "yt-tags":
        navigate("/features/youtube-tags");

        break;
      case "thumbnail-idea":
        navigate("/features/thumbnail-idea-generator");
        break;
      case "script-generator":
        navigate("/features/video-summarizer");
        break;
      default:
        navigate(`/features/${value}`);
        break;
    }
  };

  const seoData = getFeaturesPageSEO(activeTab);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title={seoData.title}
        description={seoData.description}
        canonicalUrl={seoData.canonicalUrl}
        structuredData={seoData.structuredData}
      />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-4 mb-6">
            <h1 className="text-4xl font-bold">YouTube Tools</h1>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful utilities to download and extract content from YouTube
            videos
          </p>
        </motion.div>

        <FeaturesTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default Features;
