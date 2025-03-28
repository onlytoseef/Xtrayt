
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Monitor, Smartphone, Search, Image, Eye, Clock, ThumbsUp, MessageSquare, Share2, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/components/theme-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface PortfolioData {
  gaming: PortfolioItem[];
  tech: PortfolioItem[];
  lifestyle: PortfolioItem[];
  educational: PortfolioItem[];
}

// Default portfolio data structure
const defaultPortfolioData: PortfolioData = {
  gaming: [],
  tech: [],
  lifestyle: [],
  educational: []
};

// Fallback thumbnails in case portfolio is empty
const fallbackThumbnails = [
  "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
  "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
  "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
  "https://img.youtube.com/vi/MrTz5xjmso4/maxresdefault.jpg"
];

// Sample channel data
const channelInfo = {
  name: "Your Channel",
  avatar: "https://i.pravatar.cc/150?img=3",
  subscribers: "5.2K subscribers"
};

const sampleVideoTitles = [
  "How I Built an App in 24 Hours",
  "10 Web Development Tips You Need To Know",
  "Learn React in 10 Minutes",
  "The Ultimate Guide to JavaScript",
  "Build a Portfolio Website from Scratch"
];

// Sample video durations
const sampleDurations = [
  "10:45",
  "8:23",
  "5:17",
  "12:08",
  "6:42",
  "15:31"
];

// Sample view counts
const sampleViewCounts = [
  "1.2M views",
  "856K views",
  "2.5M views",
  "423K views",
  "1.7M views",
  "925K views"
];

// Sample upload times
const sampleUploadTimes = [
  "2 weeks ago",
  "3 days ago",
  "1 month ago",
  "5 months ago",
  "1 year ago",
  "2 days ago"
];

const ThumbnailPreview = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<string>("desktop-home");
  const [previewTheme, setPreviewTheme] = useState<string>("light");
  const [videoTitle, setVideoTitle] = useState<string>("Your Video Title Here");
  const [videoDuration, setVideoDuration] = useState<string>("10:30");
  const [viewCount, setViewCount] = useState<string>("43K views");
  const [uploadTime, setUploadTime] = useState<string>("2 days ago");
  const [portfolioThumbnails, setPortfolioThumbnails] = useState<string[]>(fallbackThumbnails);
  const [portfolioTitles, setPortfolioTitles] = useState<string[]>(sampleVideoTitles);
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load portfolio data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('portfolioData');
      if (savedData) {
        const parsedData: PortfolioData = JSON.parse(savedData);
        
        // Extract all thumbnails from portfolio data
        const allThumbnails: string[] = [];
        const allTitles: string[] = [];
        
        Object.values(parsedData).forEach(category => {
          category.forEach(item => {
            if (item.imageUrl && item.imageUrl !== '/placeholder.svg') {
              allThumbnails.push(item.imageUrl);
              allTitles.push(item.title);
            }
          });
        });
        
        // If we have thumbnails from the portfolio, use them
        if (allThumbnails.length > 0) {
          // Shuffle the thumbnails array to get random order
          const shuffledThumbnails = [...allThumbnails].sort(() => Math.random() - 0.5);
          setPortfolioThumbnails(shuffledThumbnails);
          
          // Also shuffle titles if we have enough
          if (allTitles.length > 0) {
            const shuffledTitles = [...allTitles].sort(() => Math.random() - 0.5);
            setPortfolioTitles(shuffledTitles);
          }
        }
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      // Fallback to default thumbnails
      setPortfolioThumbnails(fallbackThumbnails);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size exceeds 5MB. Please upload a smaller image.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        toast.success("Thumbnail uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get thumbnail URL for a specific index
  const getThumbnailUrl = (index: number) => {
    return portfolioThumbnails[index % portfolioThumbnails.length];
  };

  // Get video title for a specific index
  const getVideoTitle = (index: number) => {
    return portfolioTitles[index % portfolioTitles.length];
  };

  const renderHomePreview = () => (
    <div className={`overflow-hidden border rounded-lg ${previewTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className={`py-3 px-4 border-b flex items-center gap-4 ${previewTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="rounded-full bg-red-600 w-8 h-8 flex items-center justify-center text-white font-bold">▶</div>
        <div className={`h-10 flex-1 flex items-center`}>
          <div className={`h-9 rounded-l-full w-full max-w-96 px-4 flex items-center ${previewTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <input type="text" placeholder="Search" className={`bg-transparent border-none outline-none w-full ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
          </div>
          <div className={`h-9 w-16 rounded-r-full flex items-center justify-center ${previewTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <Search className="h-5 w-5" />
          </div>
        </div>
        <div className="ml-auto flex gap-4 items-center">
          <button className={`h-9 w-9 rounded-full flex items-center justify-center ${previewTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Upload className="h-5 w-5" />
          </button>
          <button className={`h-9 w-9 rounded-full flex items-center justify-center ${previewTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">A</div>
        </div>
      </div>
      
      <div className={`flex ${previewTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`hidden md:block w-60 py-6 px-4 ${previewTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="space-y-4">
            {['Home', 'Explore', 'Shorts', 'Subscriptions', 'Library', 'History'].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 py-2 px-3 rounded-lg cursor-pointer ${i === 0 ? (previewTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100') : ''} ${previewTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <div className="w-6 h-6">{i === 0 ? '🏠' : i === 1 ? '🧭' : i === 2 ? '📱' : i === 3 ? '📺' : i === 4 ? '📚' : '⏱️'}</div>
                <div className="text-sm font-medium">{item}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <div key={index} className="space-y-2 cursor-pointer group">
              <div className="aspect-video rounded-xl overflow-hidden relative">
                {index === 0 && uploadedImage ? (
                  <img src={uploadedImage} alt="Your thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                ) : (
                  <img 
                    src={getThumbnailUrl(index)} 
                    alt="Sample thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackThumbnails[index % fallbackThumbnails.length];
                    }}
                  />
                )}
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                  {index === 0 ? videoDuration : sampleDurations[index % sampleDurations.length]}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="rounded-full w-9 h-9 overflow-hidden flex-shrink-0 mt-1">
                  <img src={`https://i.pravatar.cc/150?img=${index + 1}`} alt="Channel avatar" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <p className={`text-sm font-medium line-clamp-2 ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {index === 0 ? videoTitle : sampleVideoTitles[index % sampleVideoTitles.length]}
                  </p>
                  <p className={`text-xs ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {index === 0 ? channelInfo.name : `Channel ${index + 1}`}
                  </p>
                  <p className={`text-xs ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {index === 0 ? `${viewCount} • ${uploadTime}` : `${sampleViewCounts[index % sampleViewCounts.length]} • ${sampleUploadTimes[index % sampleUploadTimes.length]}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSuggestedPreview = () => (
    <div className={`overflow-hidden border rounded-lg ${previewTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-2 p-4">
          <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Your thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${previewTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <Upload className="h-10 w-10 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
              {videoDuration}
            </div>
          </div>
          
          <h3 className={`text-xl font-medium mb-2 ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {videoTitle}
          </h3>
          
          <div className={`flex items-center gap-2 text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>{viewCount}</span>
            <span>•</span>
            <span>{uploadTime}</span>
          </div>
          
          <div className="flex items-center mt-4 pb-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={channelInfo.avatar} alt={channelInfo.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className={`text-sm font-medium ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{channelInfo.name}</h4>
                <p className={`text-xs ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{channelInfo.subscribers}</p>
              </div>
            </div>
            
            <div className="ml-auto">
              <button className={`px-4 py-2 rounded-full font-medium ${previewTheme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>Subscribe</button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 pb-4 border-b border-gray-300 dark:border-gray-700">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${previewTheme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <ThumbsUp className="h-5 w-5" />
              <span>12K</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${previewTheme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <MessageSquare className="h-5 w-5" />
              <span>243</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${previewTheme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </div>
          </div>
          
          <div className={`mt-4 p-4 rounded-lg ${previewTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <p className={`text-sm font-medium ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Video description goes here. This would include details about the video content, links to resources, timestamps, and other information.
            </p>
          </div>
        </div>
        
        <div className="p-4">
          <h4 className={`mb-4 text-sm font-medium ${previewTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Up next</h4>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="flex gap-2 group cursor-pointer">
                <div className="w-40 aspect-video rounded-lg overflow-hidden relative flex-shrink-0">
                  <img 
                    src={getThumbnailUrl(index)} 
                    alt="Suggested thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackThumbnails[index % fallbackThumbnails.length];
                    }}
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                    {sampleDurations[index % sampleDurations.length]}
                  </div>
                </div>
                <div className="flex-1">
                  <h5 className={`text-sm font-medium line-clamp-2 group-hover:text-blue-500 ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {getVideoTitle(index)}
                  </h5>
                  <p className={`text-xs ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Channel name
                  </p>
                  <p className={`text-xs ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {sampleViewCounts[index % sampleViewCounts.length]} • {sampleUploadTimes[index % sampleUploadTimes.length]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobilePreview = () => (
    <div className="flex justify-center">
      <div className={`w-[350px] h-[700px] overflow-hidden border-8 rounded-3xl ${previewTheme === 'dark' ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'}`}>
        <div className={`h-12 flex items-center px-4 border-b ${previewTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="rounded-full bg-red-600 w-8 h-8 flex items-center justify-center text-white font-bold">▶</div>
          <div className="ml-auto flex items-center gap-3">
            <Search className="h-5 w-5" />
            <Bell className="h-5 w-5" />
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">A</div>
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-48px)] px-3 py-4 space-y-4">
          <div className="flex gap-1 overflow-x-auto py-1 -mx-3 px-3">
            {['All', 'Gaming', 'Music', 'Live', 'React', 'Comedy', 'Podcasts'].map((cat, i) => (
              <div 
                key={i} 
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${i === 0 
                  ? (previewTheme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') 
                  : (previewTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900')}`}
              >
                {cat}
              </div>
            ))}
          </div>
          
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className="space-y-2 group">
              <div className="aspect-video rounded-lg overflow-hidden relative">
                {index === 0 && uploadedImage ? (
                  <img src={uploadedImage} alt="Your thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                ) : (
                  <img 
                    src={getThumbnailUrl(index)} 
                    alt="Sample thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackThumbnails[index % fallbackThumbnails.length];
                    }}
                  />
                )}
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                  {index === 0 ? videoDuration : sampleDurations[index % sampleDurations.length]}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="rounded-full w-8 h-8 overflow-hidden flex-shrink-0 mt-1">
                  <img src={`https://i.pravatar.cc/150?img=${index + 1}`} alt="Channel avatar" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className={`text-sm font-medium line-clamp-2 ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {index === 0 ? videoTitle : getVideoTitle(index)}
                  </p>
                  <p className={`text-xs ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {index === 0 ? channelInfo.name : `Channel ${index + 1}`} • {index === 0 ? viewCount : sampleViewCounts[index % sampleViewCounts.length]} • {index === 0 ? uploadTime : sampleUploadTimes[index % sampleUploadTimes.length]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderComparisonPreview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <Card key={index} className={`overflow-hidden hover:shadow-md transition-shadow ${index === 0 ? "border-2 border-primary" : ""}`}>
          <CardContent className="p-0 overflow-hidden">
            <div className="aspect-video relative group cursor-pointer">
              {index === 0 && uploadedImage ? (
                <img src={uploadedImage} alt="Your thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              ) : (
                <img 
                  src={getThumbnailUrl(index)} 
                  alt="Sample thumbnail" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackThumbnails[index % fallbackThumbnails.length];
                  }}
                />
              )}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                {index === 0 ? videoDuration : sampleDurations[index % sampleDurations.length]}
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Your thumbnail
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-sm font-medium truncate mb-1">
                {index === 0 ? videoTitle : getVideoTitle(index)}
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img 
                    src={`https://i.pravatar.cc/150?img=${index + 1}`} 
                    alt="Channel avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {index === 0 ? channelInfo.name : `Channel ${index + 1}`}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {index === 0 ? `${viewCount} • ${uploadTime}` : `${sampleViewCounts[index % sampleViewCounts.length]} • ${sampleUploadTimes[index % sampleUploadTimes.length]}`}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 w-full">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
            <Eye className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">YouTube Thumbnail Preview</h2>
        <p className="text-muted-foreground">
          Visualize how your thumbnail will appear in different YouTube contexts.
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="flex flex-col w-full max-w-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video-title">Video Title</Label>
              <Input 
                id="video-title" 
                value={videoTitle} 
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter your video title"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-duration">Video Duration</Label>
              <Input 
                id="video-duration" 
                value={videoDuration} 
                onChange={(e) => setVideoDuration(e.target.value)}
                placeholder="00:00"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="view-count">View Count</Label>
              <Input 
                id="view-count" 
                value={viewCount} 
                onChange={(e) => setViewCount(e.target.value)}
                placeholder="e.g. 1.2K views"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upload-time">Upload Time</Label>
              <Input 
                id="upload-time" 
                value={uploadTime} 
                onChange={(e) => setUploadTime(e.target.value)}
                placeholder="e.g. 2 days ago"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button onClick={triggerFileInput}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Thumbnail
            </Button>
            <input 
              ref={fileInputRef}
              id="thumbnail-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
            
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Preview Theme:</span>
              <div className="flex border rounded-md p-1">
                <button
                  className={`px-2 py-1 text-xs rounded ${previewTheme === 'light' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setPreviewTheme('light')}
                >
                  Light
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${previewTheme === 'dark' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setPreviewTheme('dark')}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!uploadedImage && (
        <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <Image className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No thumbnail uploaded</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Upload a thumbnail to see how it would appear across different YouTube contexts and compare it with other videos.
          </p>
          <Button variant="outline" onClick={triggerFileInput}>
            <Upload className="mr-2 h-4 w-4" />
            Select Image
          </Button>
          <input 
            id="thumbnail-upload-center" 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleImageUpload}
          />
        </div>
      )}
      
      {uploadedImage && (
        <Tabs defaultValue="desktop-home" value={previewMode} onValueChange={setPreviewMode}>
          <TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto">
            <TabsTrigger value="desktop-home">
              <Monitor className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Home Feed</span>
            </TabsTrigger>
            <TabsTrigger value="desktop-suggested">
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Video Page</span>
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <Smartphone className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <Eye className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Comparison</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <TabsContent value="desktop-home">
              {renderHomePreview()}
            </TabsContent>
            
            <TabsContent value="desktop-suggested">
              {renderSuggestedPreview()}
            </TabsContent>
            
            <TabsContent value="mobile">
              {renderMobilePreview()}
            </TabsContent>
            
            <TabsContent value="comparison">
              {renderComparisonPreview()}
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default ThumbnailPreview;
