
import React, { useState } from 'react';
import DownloaderInput from './DownloaderInput';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, Image } from 'lucide-react';

const ThumbnailDownloader = () => {
  const [processing, setProcessing] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [quality, setQuality] = useState('maxresdefault');

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleDownload = (url: string) => {
    setProcessing(true);
    setThumbnail(null);
    
    try {
      const videoId = getYouTubeVideoId(url);
      
      if (!videoId) {
        toast.error('Could not extract video ID from URL');
        setProcessing(false);
        return;
      }

      // YouTube thumbnail URL pattern
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
      
      // In a real app, you would verify if the thumbnail exists
      // For now, we'll simulate a delay and then show the thumbnail
      setTimeout(() => {
        setThumbnail(thumbnailUrl);
        setProcessing(false);
        toast.success('Thumbnail retrieved successfully');
      }, 1500);
      
    } catch (error) {
      toast.error('An error occurred while processing your request');
      setProcessing(false);
    }
  };

  const downloadThumbnail = () => {
    if (!thumbnail) return;
    
    const link = document.createElement('a');
    link.href = thumbnail;
    link.download = `youtube-thumbnail-${quality}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ThumbnailOptions = (
    <div className="space-y-3">
      <div className="text-sm font-medium">Select Thumbnail Quality:</div>
      <RadioGroup 
        value={quality} 
        onValueChange={setQuality}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="maxresdefault" id="maxres" />
          <Label htmlFor="maxres">Max Resolution (1280×720)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sddefault" id="sd" />
          <Label htmlFor="sd">Standard (640×480)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hqdefault" id="hq" />
          <Label htmlFor="hq">High Quality (480×360)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mqdefault" id="mq" />
          <Label htmlFor="mq">Medium Quality (320×180)</Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <div className="space-y-8 w-full">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Image className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">YouTube Thumbnail Downloader</h2>
        <p className="text-muted-foreground">
          Extract high-quality thumbnails from any YouTube video with just a link.
        </p>
      </div>
      
      <DownloaderInput 
        onSubmit={handleDownload}
        showOptions={true}
        options={ThumbnailOptions}
        isProcessing={processing}
      />
      
      {thumbnail && (
        <Card className="mt-8 overflow-hidden hover-scale">
          <CardContent className="p-0 relative">
            <img 
              src={thumbnail} 
              alt="YouTube Thumbnail" 
              className="w-full h-auto"
              onError={() => {
                toast.error("Failed to load thumbnail. The selected quality might not be available.");
                setThumbnail(null);
              }}
            />
            <div 
              className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100"
              onClick={downloadThumbnail}
            >
              <div className="p-4 rounded-full bg-white/20 backdrop-blur-md cursor-pointer">
                <Download className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThumbnailDownloader;
