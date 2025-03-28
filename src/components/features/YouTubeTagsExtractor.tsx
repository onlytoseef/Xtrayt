
import React, { useState } from 'react';
import DownloaderInput from './DownloaderInput';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tag, Copy, CheckCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const YouTubeTagsExtractor = () => {
  const [processing, setProcessing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const fetchVideoDetails = async (videoId: string, apiKey: string) => {
    try {
      // Using the YouTube Data API v3
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('No video found with the given ID');
      }
      
      const videoData = data.items[0].snippet;
      
      return {
        id: videoId,
        title: videoData.title,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        tags: videoData.tags || [],
        description: videoData.description
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  };

  const handleExtract = async (url: string) => {
    setProcessing(true);
    setVideoInfo(null);
    setCopied(false);
    
    try {
      const videoId = getYouTubeVideoId(url);
      
      if (!videoId) {
        toast.error('Could not extract video ID from URL');
        setProcessing(false);
        return;
      }

      // Using the provided API key
      const apiKey = 'AIzaSyA2JyJ5X1AZt3BaFj8y1Ch6Uut2hoQLpS0';
      
      try {
        const videoData = await fetchVideoDetails(videoId, apiKey);
        setVideoInfo(videoData);
        
        if (videoData.tags && videoData.tags.length > 0) {
          toast.success(`Successfully extracted ${videoData.tags.length} tags`);
        } else {
          toast.warning('No tags found for this video');
        }
      } catch (error) {
        console.error('API error:', error);
        
        // Fallback to simulated data
        setVideoInfo({
          id: videoId,
          title: 'How to Create Amazing YouTube Thumbnails',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          tags: [
            'youtube tutorial',
            'thumbnail design',
            'youtube thumbnails',
            'clickbait thumbnails',
            'youtube growth',
            'increase CTR',
            'youtube algorithm',
            'video editing',
            'content creation',
            'graphic design',
            'photoshop tutorial',
            'canva tutorial',
            'youtube SEO',
            'video marketing'
          ]
        });
        
        toast.warning('Using demo data - API connection failed');
      }
    } catch (error) {
      toast.error('An error occurred while processing your request');
    } finally {
      setProcessing(false);
    }
  };

  const copyAllTags = () => {
    if (!videoInfo || !videoInfo.tags || videoInfo.tags.length === 0) {
      toast.error('No tags available to copy');
      return;
    }
    
    const tagString = videoInfo.tags.join(', ');
    navigator.clipboard.writeText(tagString)
      .then(() => {
        setCopied(true);
        toast.success('All tags copied to clipboard');
        
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(() => {
        toast.error('Failed to copy tags');
      });
  };

  return (
    <div className="space-y-8 w-full">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Tag className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">YouTube Tags Extractor</h2>
        <p className="text-muted-foreground">
          Extract tags from any YouTube video to improve your SEO strategy.
        </p>
      </div>
      
      <DownloaderInput 
        onSubmit={handleExtract}
        placeholder="Paste YouTube URL here..."
        isProcessing={processing}
      />
      
      {processing && (
        <Card className="mt-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="md:w-1/3 h-[180px] rounded-lg" />
              <div className="md:w-2/3 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex flex-wrap gap-2 mt-4">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-40 mt-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {videoInfo && (
        <Card className="mt-8 overflow-hidden hover-scale">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 relative overflow-hidden rounded-lg bg-gray-100">
                <img 
                  src={videoInfo.thumbnail} 
                  alt="Video Thumbnail" 
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/png?text=Video+Preview';
                  }}
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <h3 className="text-xl font-medium">{videoInfo.title}</h3>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Tags ({videoInfo.tags ? videoInfo.tags.length : 0})</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyAllTags}
                      className="text-xs"
                      disabled={!videoInfo.tags || videoInfo.tags.length === 0}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy All
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {videoInfo.tags && videoInfo.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {videoInfo.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic mt-4">
                      No tags found for this video
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Note: These tags are extracted from the video's metadata and may not be 100% accurate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YouTubeTagsExtractor;
