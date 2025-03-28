
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: any;
  pageName?: string; // Add page name to identify which page's SEO to load
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleTags?: string[];
  noIndex?: boolean;
  alternateLanguages?: {
    hrefLang: string;
    href: string;
  }[];
}

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl = 'https://xtrayt.com',
  ogType = 'website',
  ogImage = '/og-image.png',
  structuredData,
  pageName = 'home',
  articlePublishedTime,
  articleModifiedTime,
  articleTags,
  noIndex = false,
  alternateLanguages = [],
}) => {
  const [seoData, setSeoData] = useState<SEOData | null>(null);

  useEffect(() => {
    // Load SEO data from localStorage
    try {
      const storedSEOData = localStorage.getItem('seoKeywordsData');
      if (storedSEOData) {
        const parsedData = JSON.parse(storedSEOData);
        if (parsedData[pageName]) {
          setSeoData(parsedData[pageName]);
        }
      }
    } catch (error) {
      console.error('Error loading SEO data:', error);
    }
  }, [pageName]);

  // Use admin-configured SEO data if available, otherwise use props
  const finalTitle = seoData?.title || title || 'Xtrayt - Download YouTube Thumbnails, Videos & Transcripts';
  const finalDescription = seoData?.description || description || 'Xtrayt helps you download YouTube thumbnails, videos, and transcripts with just a few clicks. A simple, elegant solution for content creators.';
  const keywords = seoData?.keywords?.join(', ') || '';

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language and locale */}
      <html lang="en" />
      
      {/* Control robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Xtrayt" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Article specific meta (for blog posts) */}
      {ogType === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {ogType === 'article' && articleTags && articleTags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Alternative languages */}
      {alternateLanguages.map((lang, index) => (
        <link 
          key={index}
          rel="alternate" 
          hrefLang={lang.hrefLang} 
          href={lang.href} 
        />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
