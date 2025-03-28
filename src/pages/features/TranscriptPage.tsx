
import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import TranscriptDownloader from '@/components/features/TranscriptDownloader';

const TranscriptPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO 
        title="YouTube Transcript Downloader | YTube Tool"
        description="Extract and download transcripts from YouTube videos with our easy-to-use transcript downloader tool."
        canonicalUrl="https://ytubetool.com/features/transcript"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Transcript Downloader",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Extract and download video transcripts"
        }}
      />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">Transcript Downloader</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Extract and download transcripts from YouTube videos with our easy-to-use tool
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-4xl mx-auto"
        >
          <TranscriptDownloader />
        </motion.div>
      </div>
    </div>
  );
};

export default TranscriptPage;
