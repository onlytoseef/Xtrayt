
import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import VideoDownloader from '@/components/features/VideoDownloader';

const VideoPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO 
        title="YouTube Video Downloader | YTube Tool"
        description="Download videos from YouTube in various formats and qualities with our intuitive video downloader tool."
        canonicalUrl="https://ytubetool.com/features/video"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Video Downloader",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Download videos in various formats and qualities"
        }}
      />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">Video Downloader</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download videos from YouTube in various formats and qualities with our intuitive tool
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-4xl mx-auto"
        >
          <VideoDownloader />
        </motion.div>
      </div>
    </div>
  );
};

export default VideoPage;
