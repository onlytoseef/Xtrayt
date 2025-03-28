
import React from 'react';
import SEO from '@/components/SEO';
import YouTubeTagsExtractor from '@/components/features/YouTubeTagsExtractor';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { HomeIcon, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const YouTubeTagsPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "YouTube Tags Extractor",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "description": "Extract tags from any YouTube video to improve your SEO strategy",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "ratingCount": "124"
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO 
        title="YouTube Tags Extractor Tool | Extract Video Tags | YTube Tool"
        description="Extract tags from any YouTube video to improve your SEO strategy. Optimize your content by analyzing competitors' tags."
        pageName="youtube-tags"
        structuredData={structuredData}
        canonicalUrl="https://ytubetool.com/features/youtube-tags"
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
                <Tag className="h-4 w-4" />
                YouTube Tags Extractor
              </div>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">YouTube Tags Extractor</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Extract tags from any YouTube video to improve your SEO strategy. Analyze competitors' 
            tags and optimize your content for better visibility.
          </p>
        </div>
        
        <YouTubeTagsExtractor />
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Why YouTube Tags Matter</h2>
          <p className="mb-4">
            YouTube tags help the platform understand the content of your video, 
            improving your chances of appearing in search results and suggested videos.
            Our tags extractor tool makes it easy to analyze top-performing videos in 
            your niche.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">How to Use This Tool</h3>
          <ol className="list-decimal list-inside space-y-2 mb-6">
            <li>Paste the YouTube video URL in the input field</li>
            <li>Click the "Extract Tags" button</li>
            <li>View and copy the extracted tags</li>
            <li>Use these tags as inspiration for your own videos</li>
          </ol>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Pro Tip</h3>
            <p>
              Don't just copy tags from other videos. Use them as research to create your own 
              relevant, specific tags that accurately describe your content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeTagsPage;
