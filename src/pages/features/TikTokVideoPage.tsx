
import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import TikTokDownloader from '@/components/features/TikTokDownloader';
import { motion } from 'framer-motion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { HomeIcon, FileVideo } from 'lucide-react';
import { Link } from 'react-router-dom';

const TikTokVideoPage = () => {
  const [seoData, setSeoData] = useState({
    title: 'TikTok Video Downloader Without Watermark | YTube Tool',
    description: 'Download TikTok videos without watermark easily with our free online tool. Save high-quality TikTok content in seconds.',
    keywords: ['tiktok downloader', 'download tiktok videos', 'no watermark', 'tiktok to mp4', 'save tiktok videos']
  });

  // Load SEO data from localStorage if available
  useEffect(() => {
    try {
      const storedSEOData = localStorage.getItem('seoKeywordsData');
      if (storedSEOData) {
        const parsedData = JSON.parse(storedSEOData);
        if (parsedData['tiktok-downloader']) {
          setSeoData({
            title: parsedData['tiktok-downloader'].title,
            description: parsedData['tiktok-downloader'].description,
            keywords: parsedData['tiktok-downloader'].keywords
          });
        }
      }
    } catch (error) {
      console.error('Error loading SEO data:', error);
    }
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TikTok Video Downloader Without Watermark",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "description": "Download TikTok videos without watermark easily and quickly",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "182"
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        canonicalUrl="https://ytubetool.com/features/tiktok-downloader"
        pageName="tiktok-downloader"
        structuredData={structuredData}
      />
      
      <div className="container mx-auto px-6">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" aria-label="Home page">
                <HomeIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/features">
                Features
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <div className="flex items-center gap-1.5">
                <FileVideo className="h-4 w-4" />
                TikTok Downloader
              </div>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">TikTok Video Downloader</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download TikTok videos without watermark easily and quickly. Save TikTok content for offline viewing.
          </p>
        </motion.div>
        
        <TikTokDownloader />
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">How to Download TikTok Videos Without Watermark</h2>
          <p className="mb-4">
            Our TikTok video downloader lets you save TikTok videos without the watermark, 
            preserving the original quality for your personal use or content creation needs.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Simple Steps to Download</h3>
          <ol className="list-decimal list-inside space-y-2 mb-6">
            <li>Copy the TikTok video link from the TikTok app or website</li>
            <li>Paste the URL in the input box above</li>
            <li>Click "Download TikTok Video"</li>
            <li>Choose your preferred quality and download the video</li>
          </ol>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Important Note</h3>
            <p>
              Please use downloaded content responsibly and respect creators' rights. 
              This tool is intended for personal use only, and you should always 
              credit the original creator when sharing their content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokVideoPage;
