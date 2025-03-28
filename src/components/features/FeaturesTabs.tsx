import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThumbnailDownloader from "@/components/features/ThumbnailDownloader";
import ThumbnailPreview from "@/components/features/ThumbnailPreview";
import TikTokDownloader from "@/components/features/TikTokDownloader";
import YouTubeTagsExtractor from "@/components/features/YouTubeTagsExtractor";
import ThumbnailIdeaGenerator from "@/components/features/ThumbnailIdeaGenerator";
import VideoSummarizer from "@/components/features/VideoSummarizer";
import { motion } from "framer-motion";

interface FeaturesTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const FeaturesTabs: React.FC<FeaturesTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList className="grid grid-cols-6 mb-12 w-full overflow-x-auto">
          <TabsTrigger
            value="thumbnail"
            className="font-medium text-sm py-3 border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Thumbnails
          </TabsTrigger>
          <TabsTrigger
            value="thumbnail-preview"
            className="font-medium text-sm py-3 border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Preview
          </TabsTrigger>

          <TabsTrigger
            value="yt-tags"
            className="font-medium text-sm py-3 border-b-2 border-transparent data-[state=active]:border-primary"
          >
            YT Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thumbnail" className="animate-fade-in mt-6">
          <ThumbnailDownloader />
        </TabsContent>

        <TabsContent value="thumbnail-preview" className="animate-fade-in mt-6">
          <ThumbnailPreview />
        </TabsContent>

        <TabsContent value="thumbnail-idea" className="animate-fade-in mt-6">
          <ThumbnailIdeaGenerator />
        </TabsContent>

        <TabsContent value="script-generator" className="animate-fade-in mt-6">
          <VideoSummarizer />
        </TabsContent>

        <TabsContent value="tiktok-video" className="animate-fade-in mt-6">
          <TikTokDownloader />
        </TabsContent>

        <TabsContent value="yt-tags" className="animate-fade-in mt-6">
          <YouTubeTagsExtractor />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default FeaturesTabs;
