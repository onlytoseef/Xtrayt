
import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import VideoSummarizer from '@/components/features/VideoSummarizer';
import { trackFeatureUsage } from '@/lib/analytics';

const VideoSummarizerPage = () => {
  React.useEffect(() => {
    // Track page view
    trackFeatureUsage('video_summarizer', 'page_view');
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-background to-muted/20">
      <SEO 
        title="Video Script Generator | YTube Tool"
        description="Create compelling video scripts in multiple languages with our AI-powered tool."
        canonicalUrl="https://ytubetool.com/features/video-summarizer"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Video Script Generator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Generate engaging video scripts in multiple languages with customizable word count up to 3000 words"
        }}
      />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">Video Script Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create compelling video scripts with customizable length (up to 3000 words) and language using AI
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          <VideoSummarizer />
        </motion.div>
      </div>
    </div>
  );
};

export default VideoSummarizerPage;
