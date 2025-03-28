
interface SEODataItem {
  title: string;
  description: string;
  canonicalUrl: string;
  structuredData: any;
}

export const getFeaturesPageSEO = (activeTab: string): SEODataItem => {
  switch(activeTab) {
    case 'thumbnail':
      return {
        title: 'YouTube Thumbnail Downloader | YTube Tool',
        description: 'Download high-quality thumbnails from any YouTube video with our simple, elegant thumbnail downloader tool.',
        canonicalUrl: 'https://ytubetool.com/features/thumbnail',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Thumbnail Downloader",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Download high-quality thumbnails from any YouTube video"
        }
      };
    case 'thumbnail-preview':
      return {
        title: 'YouTube Thumbnail Preview Tool | YTube Tool',
        description: 'Preview your thumbnails in different YouTube contexts and compare them with other videos for better visibility.',
        canonicalUrl: 'https://ytubetool.com/features/thumbnail-preview',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Thumbnail Preview Tool",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Preview your thumbnails in different YouTube contexts"
        }
      };
    case 'thumbnail-idea':
      return {
        title: 'YouTube Thumbnail Idea Generator | YTube Tool',
        description: 'Generate creative and engaging thumbnail ideas for your YouTube videos with our AI-powered tool.',
        canonicalUrl: 'https://ytubetool.com/features/thumbnail-idea-generator',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Thumbnail Idea Generator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Generate creative thumbnail ideas for YouTube videos"
        }
      };
    case 'tiktok-video':
      return {
        title: 'TikTok Video Downloader | YTube Tool',
        description: 'Download TikTok videos without watermark easily with our free online tool.',
        canonicalUrl: 'https://ytubetool.com/features/tiktok-video',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "TikTok Video Downloader",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Download TikTok videos without watermark"
        }
      };
    case 'yt-tags':
      return {
        title: 'YouTube Tags Extractor | YTube Tool',
        description: 'Extract tags from any YouTube video to improve your SEO strategy.',
        canonicalUrl: 'https://ytubetool.com/features/yt-tags',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "YouTube Tags Extractor",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "description": "Extract tags from YouTube videos for SEO"
        }
      };
    default:
      return {
        title: 'YouTube Tools | YTube Tool',
        description: 'Powerful utilities to download and extract content from YouTube videos.',
        canonicalUrl: 'https://ytubetool.com/features',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "YouTube Download Tools",
          "description": "Powerful utilities to download and extract content from YouTube videos"
        }
      };
  }
};
