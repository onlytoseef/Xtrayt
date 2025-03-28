
import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import ThumbnailDownloader from '@/components/features/ThumbnailDownloader';

const ThumbnailPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO 
        title="YouTube Thumbnail Downloader | YTube Tool"
        description="Download high-quality thumbnails from any YouTube video with our simple, elegant thumbnail downloader tool."
        canonicalUrl="https://ytubetool.com/features/thumbnail"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Thumbnail Downloader",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Download high-quality thumbnails from any YouTube video"
        }}
      />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">Thumbnail Downloader</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download high-quality thumbnails from any YouTube video with just a few clicks
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-4xl mx-auto"
        >
          <ThumbnailDownloader />
        </motion.div>
      </div>
    </div>
  );
};

export default ThumbnailPage;
