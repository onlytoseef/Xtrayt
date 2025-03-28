import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Home, Save, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from "@/integrations/supabase/client";

interface HomePageContent {
  id?: string;
  hero: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    highlightedText?: string;
    highlightColor?: string;
    processedTitle?: string;
  };
  features: {
    title: string;
    description: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  logo?: string;
}

const saveToServer = async (content: HomePageContent): Promise<boolean> => {
  try {
    // Always save to localStorage
    localStorage.setItem('adminHomePageContent', JSON.stringify(content));
    
    // Mock Supabase response
    console.log("Saving content to mock Supabase:", content);
    
    // Return success
    return true;
  } catch (error) {
    console.error("Error saving content:", error);
    return false;
  }
};

const fetchFromServer = async (): Promise<HomePageContent | null> => {
  try {
    // Try to load from localStorage
    const data = localStorage.getItem('adminHomePageContent');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};

const HomePageEditor = () => {
  const defaultContent: HomePageContent = {
    hero: {
      title: "Download YouTube content with elegant simplicity",
      description: "A sleek, intuitive application for downloading thumbnails and transcripts from YouTube with just a few clicks.",
      primaryButtonText: "Get Started",
      secondaryButtonText: "Learn More",
      highlightedText: "elegant simplicity",
      highlightColor: "text-primary"
    },
    features: {
      title: "Powerful Features",
      description: "Our tools make it simple to download and use content from YouTube"
    },
    cta: {
      title: "Ready to simplify your workflow?",
      description: "Start downloading YouTube content with a clean, intuitive interface designed with attention to detail.",
      buttonText: "Explore All Features"
    },
    logo: "/logo.svg"
  };

  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [activeTab, setActiveTab] = useState("content");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const highlightColors = [
    { value: "text-primary", label: "Primary" },
    { value: "text-blue-500", label: "Blue" },
    { value: "text-green-500", label: "Green" },
    { value: "text-red-500", label: "Red" },
    { value: "text-purple-500", label: "Purple" },
    { value: "text-pink-500", label: "Pink" },
    { value: "text-amber-500", label: "Amber" },
    { value: "text-indigo-500", label: "Indigo" }
  ];

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const serverContent = await fetchFromServer();
        if (serverContent) {
          console.log("Loaded content from localStorage:", serverContent);
          setContent(serverContent);
          
          if (serverContent.logo) {
            setLogoPreview(serverContent.logo);
          }
        } else {
          // If no content found in localStorage, use default
          console.log("No content found, using default");
          setContent(defaultContent);
          if (defaultContent.logo) {
            setLogoPreview(defaultContent.logo);
          }
        }
      } catch (error) {
        console.error("Error loading home page content:", error);
        toast.error("Failed to load home page content");
        // Use default if there's an error
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  const handleChange = (section: keyof HomePageContent, field: string, value: string) => {
    setContent(prev => {
      // Create a new object for the section to avoid mutation
      const updatedSection = { ...prev[section] as Record<string, any> };
      updatedSection[field] = value;
      
      // Return a new state object with the updated section
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  const processTitle = (title: string, highlightedText: string, highlightColor: string) => {
    if (!highlightedText) return title;
    
    const escapedHighlightedText = highlightedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    return title.replace(
      new RegExp(escapedHighlightedText, 'g'), 
      `<span class="${highlightColor}">${highlightedText}</span>`
    );
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      console.log("Saving content:", content);
      const contentToStore: HomePageContent = {
        id: content.id,
        hero: {
          title: content.hero.title,
          description: content.hero.description,
          primaryButtonText: content.hero.primaryButtonText,
          secondaryButtonText: content.hero.secondaryButtonText,
          highlightedText: content.hero.highlightedText,
          highlightColor: content.hero.highlightColor
        },
        features: {
          title: content.features.title,
          description: content.features.description
        },
        cta: {
          title: content.cta.title,
          description: content.cta.description,
          buttonText: content.cta.buttonText
        }
      };
      
      if (content.logo) {
        contentToStore.logo = content.logo;
      }
      
      if (content.hero.highlightedText && content.hero.highlightColor) {
        contentToStore.hero.processedTitle = processTitle(
          content.hero.title,
          content.hero.highlightedText,
          content.hero.highlightColor
        );
      }
      
      const success = await saveToServer(contentToStore);
      if (success) {
        toast.success('Home page content saved successfully');
      } else {
        toast.error('Failed to save home page content');
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error('Failed to save home page content');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    setContent(defaultContent);
    setLogoPreview(defaultContent.logo || null);
    toast.info('Reset to default content. Click Save to apply changes.');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setLogoPreview(base64String);
      setContent(prev => ({
        ...prev,
        logo: base64String
      }));
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin mr-2">
          <RotateCcw className="h-6 w-6" />
        </div>
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Home Page Customization
          </CardTitle>
          <CardDescription>
            Customize the content of your website's home page. Changes will be saved locally.
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
              <TabsTrigger value="logo" className="flex-1">Logo</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="content">
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="text-lg font-medium">Hero Section</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Title</Label>
                  <Input 
                    id="hero-title"
                    value={content.hero.title}
                    onChange={(e) => handleChange('hero', 'title', e.target.value)}
                    placeholder="Enter hero title"
                  />
                </div>
                
                <div className="space-y-2 border-t border-dashed pt-4 mt-4">
                  <h4 className="text-md font-medium">Text Highlighting</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="highlighted-text">Text to Highlight</Label>
                    <Input 
                      id="highlighted-text"
                      value={content.hero.highlightedText || ''}
                      onChange={(e) => handleChange('hero', 'highlightedText', e.target.value)}
                      placeholder="Enter text to highlight"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the exact text you want to highlight in the title
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="highlight-color">Highlight Color</Label>
                    <Select 
                      value={content.hero.highlightColor || 'text-primary'}
                      onValueChange={(value) => handleChange('hero', 'highlightColor', value)}
                    >
                      <SelectTrigger id="highlight-color">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {highlightColors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-2 ${color.value.replace('text-', 'bg-')}`} />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mt-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-900">
                    <p className="text-sm mb-2">Preview:</p>
                    <div className="p-2 rounded bg-background">
                      <p dangerouslySetInnerHTML={{ 
                        __html: processTitle(
                          content.hero.title, 
                          content.hero.highlightedText || '', 
                          content.hero.highlightColor || 'text-primary'
                        ) 
                      }} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero-description">Description</Label>
                  <Textarea 
                    id="hero-description"
                    value={content.hero.description}
                    onChange={(e) => handleChange('hero', 'description', e.target.value)}
                    placeholder="Enter hero description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-button">Primary Button Text</Label>
                    <Input 
                      id="primary-button"
                      value={content.hero.primaryButtonText}
                      onChange={(e) => handleChange('hero', 'primaryButtonText', e.target.value)}
                      placeholder="Enter primary button text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-button">Secondary Button Text</Label>
                    <Input 
                      id="secondary-button"
                      value={content.hero.secondaryButtonText}
                      onChange={(e) => handleChange('hero', 'secondaryButtonText', e.target.value)}
                      placeholder="Enter secondary button text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="text-lg font-medium">Features Section</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="features-title">Title</Label>
                  <Input 
                    id="features-title"
                    value={content.features.title}
                    onChange={(e) => handleChange('features', 'title', e.target.value)}
                    placeholder="Enter features section title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="features-description">Description</Label>
                  <Textarea 
                    id="features-description"
                    value={content.features.description}
                    onChange={(e) => handleChange('features', 'description', e.target.value)}
                    placeholder="Enter features section description"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="text-lg font-medium">Call-to-Action Section</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cta-title">Title</Label>
                  <Input 
                    id="cta-title"
                    value={content.cta.title}
                    onChange={(e) => handleChange('cta', 'title', e.target.value)}
                    placeholder="Enter CTA title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cta-description">Description</Label>
                  <Textarea 
                    id="cta-description"
                    value={content.cta.description}
                    onChange={(e) => handleChange('cta', 'description', e.target.value)}
                    placeholder="Enter CTA description"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cta-button">Button Text</Label>
                  <Input 
                    id="cta-button"
                    value={content.cta.buttonText}
                    onChange={(e) => handleChange('cta', 'buttonText', e.target.value)}
                    placeholder="Enter CTA button text"
                  />
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="logo">
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="text-lg font-medium">Website Logo</h3>
                
                <div className="space-y-4">
                  <Label htmlFor="logo-upload">Upload Logo</Label>
                  <Input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 120 x 40 pixels. SVG or PNG format with transparency preferred.
                  </p>
                  
                  {logoPreview && (
                    <div className="mt-4">
                      <p className="text-sm mb-2">Preview:</p>
                      <div className="p-4 border rounded bg-background flex justify-center items-center">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="max-h-16 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetToDefault} disabled={isSaving}>
            Reset to Default
          </Button>
          <Button onClick={saveContent} disabled={isSaving}>
            {isSaving ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomePageEditor;

