
import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import ThumbnailPreview from '@/components/features/ThumbnailPreview';

const ThumbnailPreviewPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO 
        title="YouTube Thumbnail Preview Tool | Xtrayt"
        description="Preview your thumbnails in different YouTube contexts and compare them with other videos for better visibility."
        canonicalUrl="https://xtrayt.com/features/thumbnail-preview"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Thumbnail Preview Tool",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Preview your thumbnails in different YouTube contexts"
        }}
      />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">Thumbnail Preview</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preview your thumbnails in different YouTube contexts and compare them with other videos for better visibility
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-6xl mx-auto"
        >
          <ThumbnailPreview />
        </motion.div>
      </div>
    </div>
  );
};

export default ThumbnailPreviewPage;
