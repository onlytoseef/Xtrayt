
import React, { useState } from 'react';
import DownloaderInput from './DownloaderInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileVideo, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoDownloader = () => {
  const [processing, setProcessing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('720p');

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleDownload = (url: string) => {
    setProcessing(true);
    setVideoInfo(null);
    
    try {
      const videoId = getYouTubeVideoId(url);
      
      if (!videoId) {
        toast.error('Could not extract video ID from URL');
        setProcessing(false);
        return;
      }

      // In a real app, you would call a backend service to get video info
      // For this demo, we'll simulate with fake data
      setTimeout(() => {
        setVideoInfo({
          id: videoId,
          title: 'Sample YouTube Video',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          formats: ['mp4', 'webm', 'mp3'],
          qualities: ['1080p', '720p', '480p', '360p']
        });
        setProcessing(false);
        toast.success('Video information retrieved successfully');
      }, 1500);
      
    } catch (error) {
      toast.error('An error occurred while processing your request');
      setProcessing(false);
    }
  };

  const downloadVideo = () => {
    if (!videoInfo) return;
    
    // In a real app, this would trigger a backend download process
    // For demo purposes, we'll just show a toast
    toast.success(`Download started: ${quality} ${format}`);
    toast('In a real application, this would download the actual video file.', {
      description: 'Backend implementation needed for actual downloads.',
    });
  };

  const VideoOptions = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4 (Video)</SelectItem>
              <SelectItem value="webm">WebM (Video)</SelectItem>
              <SelectItem value="mp3">MP3 (Audio only)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Quality</label>
          <Select value={quality} onValueChange={setQuality} disabled={format === 'mp3'}>
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1080p">1080p (HD)</SelectItem>
              <SelectItem value="720p">720p (HD)</SelectItem>
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="360p">360p</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 w-full">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <FileVideo className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">YouTube Video Downloader</h2>
        <p className="text-muted-foreground">
          Download videos in various formats and qualities for offline viewing.
        </p>
      </div>
      
      <DownloaderInput 
        onSubmit={handleDownload}
        showOptions={true}
        options={VideoOptions}
        isProcessing={processing}
      />
      
      {videoInfo && (
        <Card className="mt-8 overflow-hidden hover-scale">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 relative overflow-hidden rounded-lg">
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
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Selected format: <span className="font-medium text-foreground">{format.toUpperCase()}</span></div>
                  {format !== 'mp3' && (
                    <div className="text-sm text-muted-foreground">Selected quality: <span className="font-medium text-foreground">{quality}</span></div>
                  )}
                </div>
                <Button onClick={downloadVideo} className="w-full sm:w-auto mt-4" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoDownloader;
