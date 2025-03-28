
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Upload, ImageIcon, RefreshCw } from 'lucide-react';

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

const defaultPortfolioData: PortfolioData = {
  gaming: [
    {
      id: '1',
      title: 'Gaming Thumbnail 1',
      description: 'Thumbnail for a popular gaming video',
      imageUrl: '/placeholder.svg',
      category: 'gaming'
    }
  ],
  tech: [
    {
      id: '1',
      title: 'Tech Review Thumbnail 1',
      description: 'Thumbnail for a tech review video',
      imageUrl: '/placeholder.svg',
      category: 'tech'
    }
  ],
  lifestyle: [
    {
      id: '1',
      title: 'Lifestyle Thumbnail 1',
      description: 'Thumbnail for a lifestyle video',
      imageUrl: '/placeholder.svg',
      category: 'lifestyle'
    }
  ],
  educational: [
    {
      id: '1',
      title: 'Educational Thumbnail 1',
      description: 'Thumbnail for an educational video',
      imageUrl: '/placeholder.svg',
      category: 'educational'
    }
  ]
};

const PortfolioManager: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [activeTab, setActiveTab] = useState('gaming');
  const [isSaving, setIsSaving] = useState(false);
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load saved portfolio data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('portfolioData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setPortfolioData(parsedData);
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      toast.error('Failed to load portfolio data');
    }
  }, []);

  const handleAddThumbnail = (category: keyof PortfolioData) => {
    const newThumbnail: PortfolioItem = {
      id: Date.now().toString(),
      title: `New ${category} Thumbnail`,
      description: 'Description for the new thumbnail',
      imageUrl: '/placeholder.svg',
      category: category
    };
    
    setPortfolioData(prev => ({
      ...prev,
      [category]: [...prev[category], newThumbnail]
    }));
  };

  const handleRemoveThumbnail = (category: keyof PortfolioData, id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
    
    // Also remove any preview image for this item
    if (previewImages[id]) {
      setPreviewImages(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleThumbnailChange = (
    category: keyof PortfolioData, 
    id: string, 
    field: keyof PortfolioItem, 
    value: string
  ) => {
    setPortfolioData(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleFileUpload = (id: string, category: keyof PortfolioData, file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        // Set the preview image
        setPreviewImages(prev => ({
          ...prev,
          [id]: e.target!.result as string
        }));
        
        // Update the actual data
        handleThumbnailChange(category, id, 'imageUrl', e.target.result);
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read the image file');
    };
    
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Ensure all preview images are saved to the portfolio data
      const updatedPortfolioData = { ...portfolioData };
      
      Object.entries(previewImages).forEach(([id, imageUrl]) => {
        Object.keys(updatedPortfolioData).forEach((categoryKey) => {
          const category = categoryKey as keyof PortfolioData;
          const itemIndex = updatedPortfolioData[category].findIndex(item => item.id === id);
          
          if (itemIndex !== -1) {
            updatedPortfolioData[category][itemIndex].imageUrl = imageUrl;
          }
        });
      });
      
      localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolioData));
      toast.success('Portfolio data saved successfully');
      
      // Also update the state
      setPortfolioData(updatedPortfolioData);
      
      // After successful save, sync the services page data thumbnailUrl with portfolio thumbnails
      updateServiceCategoriesWithPortfolioThumbnails(updatedPortfolioData);
    } catch (error) {
      console.error('Error saving portfolio data:', error);
      toast.error('Failed to save portfolio data');
    } finally {
      setIsSaving(false);
    }
  };

  // Update service categories thumbnailUrl with portfolio thumbnails
  const updateServiceCategoriesWithPortfolioThumbnails = (portfolioData: PortfolioData) => {
    try {
      const servicesData = localStorage.getItem('servicesPageData');
      if (servicesData) {
        const parsedData = JSON.parse(servicesData);
        
        if (parsedData.categories && Array.isArray(parsedData.categories)) {
          let updated = false;
          
          const updatedCategories = parsedData.categories.map((category: any) => {
            // Extract category name from link
            const categoryName = category.link.split('/').pop();
            
            if (categoryName && portfolioData[categoryName as keyof PortfolioData]) {
              const items = portfolioData[categoryName as keyof PortfolioData];
              if (items.length > 0) {
                updated = true;
                return {
                  ...category,
                  thumbnailUrl: items[0].imageUrl
                };
              }
            }
            return category;
          });
          
          if (updated) {
            parsedData.categories = updatedCategories;
            localStorage.setItem('servicesPageData', JSON.stringify(parsedData));
            toast.success('Service categories updated with portfolio thumbnails');
          }
        }
      }
    } catch (error) {
      console.error('Error updating service categories:', error);
    }
  };

  const triggerFileInput = (id: string) => {
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]?.click();
    }
  };

  const getDisplayImage = (item: PortfolioItem) => {
    return previewImages[item.id] || item.imageUrl || '/placeholder.svg';
  };

  const renderThumbnails = (category: keyof PortfolioData) => {
    return portfolioData[category].map((thumbnail) => (
      <Card key={thumbnail.id} className="relative mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 text-destructive z-10"
          onClick={() => handleRemoveThumbnail(category, thumbnail.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <CardContent className="p-6 space-y-4">
          <div className="relative aspect-video bg-secondary rounded-md overflow-hidden mb-4">
            <img 
              src={getDisplayImage(thumbnail)} 
              alt={thumbnail.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/60">
              <Button 
                variant="secondary"
                size="sm"
                className="mr-2"
                onClick={() => triggerFileInput(thumbnail.id)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              
              <input
                ref={(el) => fileInputRefs.current[thumbnail.id] = el}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(thumbnail.id, category, file);
                  }
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`title-${thumbnail.id}`}>Title</Label>
            <Input
              id={`title-${thumbnail.id}`}
              value={thumbnail.title}
              onChange={(e) => handleThumbnailChange(category, thumbnail.id, 'title', e.target.value)}
              placeholder="Thumbnail title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`desc-${thumbnail.id}`}>Description</Label>
            <Input
              id={`desc-${thumbnail.id}`}
              value={thumbnail.description}
              onChange={(e) => handleThumbnailChange(category, thumbnail.id, 'description', e.target.value)}
              placeholder="Thumbnail description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`img-${thumbnail.id}`}>External Image URL (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id={`img-${thumbnail.id}`}
                value={thumbnail.imageUrl}
                onChange={(e) => handleThumbnailChange(category, thumbnail.id, 'imageUrl', e.target.value)}
                placeholder="External image URL"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (thumbnail.imageUrl && thumbnail.imageUrl !== '/placeholder.svg') {
                    setPreviewImages(prev => ({
                      ...prev,
                      [thumbnail.id]: thumbnail.imageUrl
                    }));
                    toast.success('Image refreshed from URL');
                  } else {
                    toast.error('Please enter a valid image URL first');
                  }
                }}
                title="Refresh image from URL"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Thumbnails Manager</CardTitle>
        <CardDescription>
          Manage thumbnails for different categories in your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="educational">Educational</TabsTrigger>
          </TabsList>

          <TabsContent value="gaming" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Gaming Thumbnails</h3>
              <Button 
                onClick={() => handleAddThumbnail('gaming')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Thumbnail
              </Button>
            </div>
            {renderThumbnails('gaming')}
          </TabsContent>

          <TabsContent value="tech" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tech Thumbnails</h3>
              <Button 
                onClick={() => handleAddThumbnail('tech')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Thumbnail
              </Button>
            </div>
            {renderThumbnails('tech')}
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Lifestyle Thumbnails</h3>
              <Button 
                onClick={() => handleAddThumbnail('lifestyle')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Thumbnail
              </Button>
            </div>
            {renderThumbnails('lifestyle')}
          </TabsContent>

          <TabsContent value="educational" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Educational Thumbnails</h3>
              <Button 
                onClick={() => handleAddThumbnail('educational')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Thumbnail
              </Button>
            </div>
            {renderThumbnails('educational')}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          className="ml-auto"
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PortfolioManager;
