
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Upload, CheckCircle2, XCircle, Tag } from 'lucide-react';

interface SEOKeywordItem {
  title: string;
  description: string;
  keywords: string[];
}

interface SEOKeywordsData {
  [key: string]: SEOKeywordItem;
}

const pages = [
  { id: 'home', name: 'Home Page', path: '/' },
  { id: 'features', name: 'Features Page', path: '/features' },
  { id: 'services', name: 'Services Page', path: '/services' },
  { id: 'about', name: 'About Page', path: '/about' },
  { id: 'youtube-tags', name: 'YouTube Tags', path: '/features/youtube-tags' },
  { id: 'video', name: 'Video Downloader', path: '/features/video' },
  { id: 'thumbnail', name: 'Thumbnail Downloader', path: '/features/thumbnail' },
  { id: 'thumbnail-preview', name: 'Thumbnail Preview', path: '/features/thumbnail-preview' },
  { id: 'transcript', name: 'Transcript Tool', path: '/features/transcript' },
  { id: 'tiktok-downloader', name: 'TikTok Downloader', path: '/features/tiktok-downloader' }
];

const SEOKeywordsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSaving, setIsSaving] = useState(false);
  const [seoData, setSeoData] = useState<SEOKeywordsData>({});
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [newKeyword, setNewKeyword] = useState('');
  const [batchKeywords, setBatchKeywords] = useState('');

  // Load saved SEO data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('seoKeywordsData');
      if (savedData) {
        setSeoData(JSON.parse(savedData));
      } else {
        // Initialize with default data
        const defaultData: SEOKeywordsData = {};
        pages.forEach(page => {
          defaultData[page.id] = {
            title: `${page.name} | YTube Tool`,
            description: `Description for ${page.name}`,
            keywords: ['youtube', 'tool', page.id]
          };
        });
        setSeoData(defaultData);
      }
    } catch (error) {
      console.error('Error loading SEO data:', error);
      toast.error('Failed to load SEO data');
    }
  }, []);

  const getPageData = (pageId: string): SEOKeywordItem => {
    return seoData[pageId] || { title: '', description: '', keywords: [] };
  };

  const handlePageSelect = (pageId: string) => {
    setCurrentPage(pageId);
    setActiveTab(pageId);
  };

  const handleFieldChange = (field: 'title' | 'description', value: string) => {
    setSeoData(prev => ({
      ...prev,
      [currentPage]: {
        ...getPageData(currentPage),
        [field]: value
      }
    }));
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    setSeoData(prev => {
      const currentKeywords = getPageData(currentPage).keywords || [];
      
      if (!currentKeywords.includes(newKeyword.trim())) {
        return {
          ...prev,
          [currentPage]: {
            ...getPageData(currentPage),
            keywords: [...currentKeywords, newKeyword.trim()]
          }
        };
      }
      return prev;
    });
    
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSeoData(prev => ({
      ...prev,
      [currentPage]: {
        ...getPageData(currentPage),
        keywords: getPageData(currentPage).keywords.filter(k => k !== keyword)
      }
    }));
  };

  const handleAddBatchKeywords = () => {
    if (!batchKeywords.trim()) return;
    
    // Split by commas, newlines, or spaces
    const keywords = batchKeywords
      .split(/[\n,\s]+/)
      .map(k => k.trim())
      .filter(k => k !== '');
      
    if (keywords.length > 0) {
      setSeoData(prev => {
        const currentKeywords = new Set(getPageData(currentPage).keywords || []);
        
        // Add new keywords without duplicates
        keywords.forEach(keyword => {
          currentKeywords.add(keyword);
        });
        
        return {
          ...prev,
          [currentPage]: {
            ...getPageData(currentPage),
            keywords: Array.from(currentKeywords)
          }
        };
      });
      
      setBatchKeywords('');
      toast.success(`Added ${keywords.length} keywords`);
    }
  };

  const handleClearKeywords = () => {
    setSeoData(prev => ({
      ...prev,
      [currentPage]: {
        ...getPageData(currentPage),
        keywords: []
      }
    }));
    toast.success('All keywords cleared');
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('seoKeywordsData', JSON.stringify(seoData));
      toast.success('SEO data saved successfully');
    } catch (error) {
      console.error('Error saving SEO data:', error);
      toast.error('Failed to save SEO data');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          SEO Keywords Manager
        </CardTitle>
        <CardDescription>
          Manage SEO metadata for all pages of your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handlePageSelect}>
          <TabsList className="flex flex-wrap mb-6">
            {pages.map(page => (
              <TabsTrigger key={page.id} value={page.id} className="text-xs md:text-sm">
                {page.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {pages.map(page => (
            <TabsContent key={page.id} value={page.id} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`seo-title-${page.id}`}>Page Title</Label>
                  <Input
                    id={`seo-title-${page.id}`}
                    value={getPageData(page.id).title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="Enter page title"
                  />
                  <p className="text-xs text-muted-foreground">
                    The title that appears in search results (50-60 characters recommended)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`seo-description-${page.id}`}>Meta Description</Label>
                  <Textarea
                    id={`seo-description-${page.id}`}
                    value={getPageData(page.id).description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Enter page description"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description that appears in search results (150-160 characters recommended)
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Keywords</Label>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleClearKeywords} 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add keyword"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                    />
                    <Button onClick={handleAddKeyword} className="whitespace-nowrap">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getPageData(page.id).keywords?.map((keyword, index) => (
                      <div 
                        key={index} 
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {keyword}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-1 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveKeyword(keyword)}
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 mt-4 border-t pt-4">
                    <Label htmlFor="batch-keywords">Batch Add Keywords</Label>
                    <Textarea
                      id="batch-keywords"
                      value={batchKeywords}
                      onChange={(e) => setBatchKeywords(e.target.value)}
                      placeholder="Enter multiple keywords separated by commas, spaces, or new lines"
                      rows={3}
                    />
                    <Button onClick={handleAddBatchKeywords} variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Add Batch Keywords
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          className="ml-auto"
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SEOKeywordsManager;
