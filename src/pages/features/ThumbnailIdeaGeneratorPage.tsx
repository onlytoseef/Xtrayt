
import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import ThumbnailIdeaGenerator from '@/components/features/ThumbnailIdeaGenerator';
import { trackFeatureUsage } from '@/lib/analytics';

const ThumbnailIdeaGeneratorPage = () => {
  React.useEffect(() => {
    // Track page view
    trackFeatureUsage('thumbnail_idea_generator', 'page_view');
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-background to-muted/20">
      <SEO 
        title="YouTube Thumbnail Idea Generator | YTube Tool"
        description="Generate creative and engaging thumbnail ideas for your YouTube videos with our AI-powered tool."
        canonicalUrl="https://ytubetool.com/features/thumbnail-idea-generator"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Thumbnail Idea Generator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Generate creative thumbnail ideas for YouTube videos"
        }}
      />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">Thumbnail Idea Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate creative and engaging thumbnail ideas (up to 200 words) for your YouTube videos using AI
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          <ThumbnailIdeaGenerator />
        </motion.div>
      </div>
    </div>
  );
};

export default ThumbnailIdeaGeneratorPage;
