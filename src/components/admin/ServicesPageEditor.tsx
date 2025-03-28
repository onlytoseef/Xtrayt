
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Save, Plus, Trash2, UserIcon, Star, Upload, Check, ExternalLink, 
  X, ImagePlus, GripVertical, ImageOff, Loader2, FolderPlus, FileImage, Folder
} from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ImageIcon } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  thumbnailUrl: string;
  portfolioItems?: PortfolioItem[];
}

interface ClientReview {
  id: string;
  name: string;
  image: string;
  review: string;
  stars: number;
}

interface SocialMediaLink {
  platform: string;
  url: string;
  enabled: boolean;
}

interface ServicesPageData {
  profile: {
    name: string;
    title: string;
    bio: string;
    description: string;
    avatar: string;
    socialHandle: string;
  };
  categories: ServiceCategory[];
  stats: {
    clients: number;
    thumbnails: number;
    views: number;
  };
  reviews: ClientReview[];
  socialMedia: SocialMediaLink[];
}

const ServicesPageEditor = () => {
  const [data, setData] = useState<ServicesPageData>({
    profile: {
      name: '',
      title: '',
      bio: '',
      description: '',
      avatar: '',
      socialHandle: ''
    },
    categories: [],
    stats: {
      clients: 0,
      thumbnails: 0,
      views: 0
    },
    reviews: [],
    socialMedia: []
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [portfolioImagePreview, setPortfolioImagePreview] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('servicesPageData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    try {
      localStorage.setItem('servicesPageData', JSON.stringify(data));
      toast.success('Services page data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleStatsChange = (field: string, value: number) => {
    setData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [field]: value
      }
    }));
  };

  const addCategory = () => {
    const newCategory: ServiceCategory = {
      id: `category-${Date.now()}`,
      title: 'New Category',
      description: 'Description of the category',
      icon: 'Star',
      link: '/portfolio/new-category',
      thumbnailUrl: '',
      portfolioItems: []
    };

    setData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));

    setEditingCategoryId(newCategory.id);
  };

  const updateCategory = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const deleteCategory = (id: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== id)
    }));
  };

  const handlePreviewThumbnail = (url: string) => {
    if (!url) {
      setThumbnailPreview(null);
      return;
    }

    setIsPreviewLoading(true);
    
    // Fix: Create a new Image with document.createElement instead of the constructor
    const img = document.createElement('img');
    img.onload = () => {
      setThumbnailPreview(url);
      setIsPreviewLoading(false);
    };
    img.onerror = () => {
      toast.error("Invalid image URL");
      setThumbnailPreview(null);
      setIsPreviewLoading(false);
    };
    img.src = url;
  };

  const addPortfolioItem = (categoryId: string) => {
    const newItem: PortfolioItem = {
      id: `portfolio-${Date.now()}`,
      title: 'New Portfolio Item',
      imageUrl: '',
      description: 'Description of the portfolio item'
    };

    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? { 
              ...cat, 
              portfolioItems: [...(cat.portfolioItems || []), newItem] 
            } 
          : cat
      )
    }));
  };

  const updatePortfolioItem = (categoryId: string, itemId: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? { 
              ...cat, 
              portfolioItems: (cat.portfolioItems || []).map(item => 
                item.id === itemId ? { ...item, [field]: value } : item
              ) 
            } 
          : cat
      )
    }));
  };

  const deletePortfolioItem = (categoryId: string, itemId: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? { 
              ...cat, 
              portfolioItems: (cat.portfolioItems || []).filter(item => item.id !== itemId) 
            } 
          : cat
      )
    }));
  };

  const handlePreviewPortfolioImage = (url: string) => {
    if (!url) {
      setPortfolioImagePreview(null);
      return;
    }

    setIsPreviewLoading(true);
    
    // Fix: Create a new Image with document.createElement('img');
    const img = document.createElement('img');
    img.onload = () => {
      setPortfolioImagePreview(url);
      setIsPreviewLoading(false);
    };
    img.onerror = () => {
      toast.error("Invalid image URL");
      setPortfolioImagePreview(null);
      setIsPreviewLoading(false);
    };
    img.src = url;
  };

  const addReview = () => {
    const newReview: ClientReview = {
      id: `review-${Date.now()}`,
      name: 'Client Name',
      image: '',
      review: 'Great service!',
      stars: 5
    };

    setData(prev => ({
      ...prev,
      reviews: [...prev.reviews, newReview]
    }));

    setEditingReviewId(newReview.id);
  };

  const updateReview = (id: string, field: string, value: string | number) => {
    setData(prev => ({
      ...prev,
      reviews: prev.reviews.map(review => 
        review.id === id ? { ...review, [field]: value } : review
      )
    }));
  };

  const deleteReview = (id: string) => {
    setData(prev => ({
      ...prev,
      reviews: prev.reviews.filter(review => review.id !== id)
    }));
  };

  const addSocialMedia = () => {
    if (!newSocialPlatform || !newSocialUrl) {
      toast.error('Platform and URL are required');
      return;
    }

    const newSocial: SocialMediaLink = {
      platform: newSocialPlatform,
      url: newSocialUrl,
      enabled: true
    };

    setData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, newSocial]
    }));

    setNewSocialPlatform('');
    setNewSocialUrl('');
  };

  const updateSocialMedia = (index: number, field: string, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((social, i) => 
        i === index ? { ...social, [field]: value } : social
      )
    }));
  };

  const deleteSocialMedia = (index: number) => {
    setData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Star': return <Star className="h-5 w-5" />;
      case 'UserIcon': return <UserIcon className="h-5 w-5" />;
      case 'Image': return <ImageIcon className="h-5 w-5" />; // Fixed: Use ImageIcon instead of Image
      default: return <Star className="h-5 w-5" />;
    }
  };

  const handleFileDrop = (e: React.DragEvent, categoryId: string, itemId?: string) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        
        if (itemId) {
          // Updating portfolio item image
          updatePortfolioItem(categoryId, itemId, 'imageUrl', imageUrl);
          handlePreviewPortfolioImage(imageUrl);
        } else {
          // Updating category thumbnail
          updateCategory(categoryId, 'thumbnailUrl', imageUrl);
          handlePreviewThumbnail(imageUrl);
        }
        
        toast.success('Image uploaded successfully');
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const [newThumbnailData, setNewThumbnailData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    categoryId: ''
  });

  const handleThumbnailChange = (field: string, value: string) => {
    setNewThumbnailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addNewThumbnail = () => {
    if (!newThumbnailData.title || !newThumbnailData.imageUrl || !newThumbnailData.categoryId) {
      toast.error('Title, image URL, and category are required');
      return;
    }

    const newItem: PortfolioItem = {
      id: `portfolio-${Date.now()}`,
      title: newThumbnailData.title,
      imageUrl: newThumbnailData.imageUrl,
      description: newThumbnailData.description
    };

    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === newThumbnailData.categoryId 
          ? { 
              ...cat, 
              portfolioItems: [...(cat.portfolioItems || []), newItem] 
            } 
          : cat
      )
    }));

    // Reset form
    setNewThumbnailData({
      title: '',
      description: '',
      imageUrl: '',
      categoryId: ''
    });

    toast.success('Thumbnail added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services Page Editor</h2>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="categories">Categories & Thumbnails</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your professional profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={data.profile.name} 
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input 
                    id="title" 
                    value={data.profile.title} 
                    onChange={(e) => handleProfileChange('title', e.target.value)}
                    placeholder="e.g. Digital Marketing Specialist"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea 
                  id="bio" 
                  value={data.profile.bio} 
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  placeholder="Brief professional bio (1-2 sentences)"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  value={data.profile.description} 
                  onChange={(e) => handleProfileChange('description', e.target.value)}
                  placeholder="More detailed professional description"
                  rows={4}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input 
                    id="avatar" 
                    value={data.profile.avatar} 
                    onChange={(e) => handleProfileChange('avatar', e.target.value)}
                    placeholder="URL to your profile image"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialHandle">Social Media Handle</Label>
                  <Input 
                    id="socialHandle" 
                    value={data.profile.socialHandle} 
                    onChange={(e) => handleProfileChange('socialHandle', e.target.value)}
                    placeholder="@username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Category Management
                </CardTitle>
                <CardDescription>
                  Add and manage service categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Categories</h3>
                  <Button onClick={addCategory} size="sm" className="flex items-center gap-1">
                    <FolderPlus className="h-4 w-4" />
                    Add Category
                  </Button>
                </div>
                
                {data.categories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 border rounded-md bg-muted/30">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <FolderPlus className="h-6 w-6" />
                    </div>
                    <p className="text-center text-muted-foreground mb-3">No categories added yet</p>
                    <Button onClick={addCategory} variant="outline" size="sm">Add your first category</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.categories.map((category) => (
                      <Card key={category.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-2 items-center">
                              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                              <div className="flex flex-col">
                                <CardTitle>
                                  <Input 
                                    value={category.title} 
                                    onChange={(e) => updateCategory(category.id, 'title', e.target.value)}
                                    className="h-7 px-2 font-bold text-base"
                                    placeholder="Category Name"
                                  />
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  <Input 
                                    value={category.link} 
                                    onChange={(e) => updateCategory(category.id, 'link', e.target.value)}
                                    className="h-6 px-2 text-xs"
                                    placeholder="/portfolio/category-name"
                                  />
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setEditingCategoryId(editingCategoryId === category.id ? null : category.id)}
                              >
                                {editingCategoryId === category.id ? (
                                  <X className="h-4 w-4" />
                                ) : (
                                  <ExternalLink className="h-4 w-4" />
                                )}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => deleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {editingCategoryId === category.id && (
                          <CardContent className="pb-3 pt-0">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`category-description-${category.id}`}>Description</Label>
                                <Textarea 
                                  id={`category-description-${category.id}`}
                                  value={category.description} 
                                  onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                                  rows={2}
                                  placeholder="Enter a description for this category"
                                />
                              </div>
                              
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="space-y-2 flex-1">
                                  <Label htmlFor={`category-icon-${category.id}`}>Icon</Label>
                                  <div className="flex gap-2">
                                    <Input 
                                      id={`category-icon-${category.id}`}
                                      value={category.icon} 
                                      onChange={(e) => updateCategory(category.id, 'icon', e.target.value)}
                                      placeholder="Icon name (Star, UserIcon, Image)"
                                    />
                                    <div className="flex items-center justify-center w-10 h-10 border rounded">
                                      {getIconComponent(category.icon)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`category-thumbnail-${category.id}`}>
                                  Category Thumbnail
                                </Label>
                                <div className="flex gap-2">
                                  <Input 
                                    id={`category-thumbnail-${category.id}`}
                                    value={category.thumbnailUrl} 
                                    onChange={(e) => {
                                      updateCategory(category.id, 'thumbnailUrl', e.target.value);
                                      handlePreviewThumbnail(e.target.value);
                                    }}
                                    placeholder="Thumbnail URL"
                                  />
                                  <Button 
                                    variant="outline" 
                                    className="shrink-0"
                                    onClick={() => handlePreviewThumbnail(category.thumbnailUrl)}
                                  >
                                    <ImageIcon className="h-4 w-4" /> 
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Enter a URL or drag & drop an image below</p>
                              </div>
                              
                              <div 
                                className="mt-2 border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                                onDrop={(e) => handleFileDrop(e, category.id)}
                                onDragOver={handleDragOver}
                              >
                                {isPreviewLoading ? (
                                  <div className="flex flex-col items-center gap-2 py-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Loading preview...</p>
                                  </div>
                                ) : thumbnailPreview && thumbnailPreview === category.thumbnailUrl ? (
                                  <div className="flex flex-col items-center">
                                    <div className="relative w-full max-w-xs mx-auto aspect-video overflow-hidden rounded-md mb-2">
                                      <img 
                                        src={thumbnailPreview} 
                                        alt="Thumbnail preview" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = '/placeholder.svg';
                                        }}
                                      />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Drag & drop a new image to replace</p>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-2 py-6">
                                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Drag & drop an image here or click preview</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thumbnails Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Thumbnail Management
                </CardTitle>
                <CardDescription>
                  Add and manage thumbnails for your categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-title">Thumbnail Title</Label>
                    <Input 
                      id="thumbnail-title" 
                      value={newThumbnailData.title}
                      onChange={(e) => handleThumbnailChange('title', e.target.value)}
                      placeholder="Enter thumbnail title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-description">Description (optional)</Label>
                    <Textarea 
                      id="thumbnail-description"
                      value={newThumbnailData.description}
                      onChange={(e) => handleThumbnailChange('description', e.target.value)}
                      placeholder="Enter thumbnail description"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-category">Category</Label>
                    <Select 
                      value={newThumbnailData.categoryId} 
                      onValueChange={(value) => handleThumbnailChange('categoryId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.categories.length === 0 ? (
                          <SelectItem value="no-categories" disabled>
                            No categories available
                          </SelectItem>
                        ) : (
                          data.categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-url">
                      Thumbnail URL <span className="text-xs text-muted-foreground">(or drag & drop)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id="thumbnail-url"
                        value={newThumbnailData.imageUrl}
                        onChange={(e) => {
                          handleThumbnailChange('imageUrl', e.target.value);
                          handlePreviewPortfolioImage(e.target.value);
                        }}
                        placeholder="Enter image URL"
                      />
                      <Button 
                        variant="outline" 
                        className="shrink-0"
                        onClick={() => handlePreviewPortfolioImage(newThumbnailData.imageUrl)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div 
                    className="mt-2 border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                    onDrop={(e) => {
                      e.preventDefault();
                      
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        
                        if (!file.type.startsWith('image/')) {
                          toast.error('Only image files are allowed');
                          return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const imageUrl = event.target?.result as string;
                          handleThumbnailChange('imageUrl', imageUrl);
                          handlePreviewPortfolioImage(imageUrl);
                          toast.success('Image uploaded successfully');
                        };
                        
                        reader.readAsDataURL(file);
                      }
                    }}
                    onDragOver={handleDragOver}
                  >
                    {isPreviewLoading ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Loading preview...</p>
                      </div>
                    ) : portfolioImagePreview && portfolioImagePreview === newThumbnailData.imageUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-full max-w-xs mx-auto aspect-video overflow-hidden rounded-md mb-2">
                          <img 
                            src={portfolioImagePreview} 
                            alt="Thumbnail preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">Drag & drop a new image to replace</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-6">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drag & drop an image here or click preview</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={addNewThumbnail}
                      disabled={!newThumbnailData.title || !newThumbnailData.imageUrl || !newThumbnailData.categoryId}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Thumbnail
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Your Thumbnails</h3>
                  
                  {data.categories.some(cat => cat.portfolioItems && cat.portfolioItems.length > 0) ? (
                    data.categories.map(category => (
                      category.portfolioItems && category.portfolioItems.length > 0 && (
                        <div key={category.id} className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">{category.title}</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {category.portfolioItems.map(item => (
                              <div key={item.id} className="border rounded-md p-3 relative group">
                                <div className="aspect-video overflow-hidden rounded-md mb-2">
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder.svg';
                                    }}
                                  />
                                </div>
                                <p className="text-sm font-medium truncate">{item.title}</p>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="destructive" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => deletePortfolioItem(category.id, item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 border rounded-md bg-muted/30">
                      <div className="rounded-full bg-muted p-3 mb-3">
                        <ImageOff className="h-6 w-6" />
                      </div>
                      <p className="text-center text-muted-foreground">No thumbnails added yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Original Portfolio Items Management (only show with detailed view toggle) */}
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Detailed Portfolio Items</h3>
            </div>
            
            {data.categories.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Plus className="h-6 w-6" />
                  </div>
                  <p className="text-center text-muted-foreground mb-3">No categories added yet</p>
                  <Button onClick={addCategory} variant="outline" size="sm">Add your first category</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.categories.map((category) => (
                  <Card key={category.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 items-center">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                          <div>
                            <CardTitle>{category.title}</CardTitle>
                            <CardDescription>{category.portfolioItems?.length || 0} items</CardDescription>
                          </div>
                        </div>
                        <Button 
                          onClick={() => addPortfolioItem(category.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {category.portfolioItems && category.portfolioItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {category.portfolioItems.map(item => (
                            <Card key={item.id} className="overflow-hidden">
                              <div className="aspect-video relative">
                                <img
                                  src={item.imageUrl || '/placeholder.svg'}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  className="absolute top-2 right-2 h-7 w-7 opacity-80 hover:opacity-100"
                                  onClick={() => deletePortfolioItem(category.id, item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <CardContent className="p-3">
                                <div className="space-y-2">
                                  <Input 
                                    value={item.title}
                                    onChange={(e) => updatePortfolioItem(category.id, item.id, 'title', e.target.value)}
                                    className="font-medium"
                                    placeholder="Item title"
                                  />
                                  <Textarea 
                                    value={item.description || ''}
                                    onChange={(e) => updatePortfolioItem(category.id, item.id, 'description', e.target.value)}
                                    placeholder="Item description"
                                    rows={2}
                                    className="text-sm"
                                  />
                                  <div className="flex items-center gap-2">
                                    <Input 
                                      value={item.imageUrl}
                                      onChange={(e) => updatePortfolioItem(category.id, item.id, 'imageUrl', e.target.value)}
                                      placeholder="Image URL"
                                      className="text-xs"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      className="shrink-0"
                                      onClick={() => {
                                        // Handle image preview or upload
                                      }}
                                    >
                                      <ImageIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 border rounded-md bg-muted/30">
                          <div className="rounded-full bg-muted p-3 mb-3">
                            <ImageOff className="h-6 w-6" />
                          </div>
                          <p className="text-center text-muted-foreground mb-3">No portfolio items added yet</p>
                          <Button onClick={() => addPortfolioItem(category.id)} variant="outline" size="sm">
                            Add your first item
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Manage statistics displayed on your services page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="clients-count">Clients Count</Label>
                  <Input 
                    id="clients-count" 
                    type="number"
                    value={data.stats.clients} 
                    onChange={(e) => handleStatsChange('clients', parseInt(e.target.value) || 0)}
                    placeholder="Number of clients"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnails-count">Thumbnails Count</Label>
                  <Input 
                    id="thumbnails-count" 
                    type="number"
                    value={data.stats.thumbnails} 
                    onChange={(e) => handleStatsChange('thumbnails', parseInt(e.target.value) || 0)}
                    placeholder="Number of thumbnails"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="views-count">Views Count</Label>
                  <Input 
                    id="views-count" 
                    type="number"
                    value={data.stats.views} 
                    onChange={(e) => handleStatsChange('views', parseInt(e.target.value) || 0)}
                    placeholder="Number of views"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>Manage reviews from your clients</CardDescription>
              </div>
              <Button onClick={addReview} className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Review
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 border rounded-md bg-muted/30">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Star className="h-6 w-6" />
                  </div>
                  <p className="text-center text-muted-foreground mb-3">No reviews added yet</p>
                  <Button onClick={addReview} variant="outline" size="sm">Add your first review</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.reviews.map((review) => (
                    <Card key={review.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {review.image ? (
                              <img 
                                src={review.image} 
                                alt={review.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <CardTitle>
                                <Input 
                                  value={review.name} 
                                  onChange={(e) => updateReview(review.id, 'name', e.target.value)}
                                  className="h-7 px-2 font-bold text-base"
                                  placeholder="Client Name"
                                />
                              </CardTitle>
                              <div className="flex mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => updateReview(review.id, 'stars', star)}
                                    className="p-0 bg-transparent border-none cursor-pointer"
                                  >
                                    <Star
                                      className={`h-4 w-4 ${
                                        star <= review.stars
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => deleteReview(review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <Label htmlFor={`review-text-${review.id}`}>Review</Label>
                          <Textarea 
                            id={`review-text-${review.id}`}
                            value={review.review} 
                            onChange={(e) => updateReview(review.id, 'review', e.target.value)}
                            rows={3}
                            placeholder="Client's review text"
                          />
                        </div>
                        <div className="space-y-2 mt-3">
                          <Label htmlFor={`review-image-${review.id}`}>Client Photo URL</Label>
                          <Input 
                            id={`review-image-${review.id}`}
                            value={review.image} 
                            onChange={(e) => updateReview(review.id, 'image', e.target.value)}
                            placeholder="URL to client's photo"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Manage your social media profiles</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="social-platform">Platform</Label>
                  <Input 
                    id="social-platform" 
                    value={newSocialPlatform}
                    onChange={(e) => setNewSocialPlatform(e.target.value)}
                    placeholder="e.g. Instagram, Twitter, LinkedIn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social-url">URL</Label>
                  <Input 
                    id="social-url" 
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={addSocialMedia}
                  disabled={!newSocialPlatform || !newSocialUrl}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Social Link
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              {data.socialMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 border rounded-md bg-muted/30">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Plus className="h-6 w-6" />
                  </div>
                  <p className="text-center text-muted-foreground mb-3">No social media links added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.socialMedia.map((social, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className={`h-4 w-4 ${social.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <div className="font-medium">{social.platform}</div>
                          <a 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
                          >
                            {social.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={social.enabled ? "outline" : "default"} 
                          size="sm"
                          onClick={() => updateSocialMedia(index, 'enabled', !social.enabled)}
                        >
                          {social.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => deleteSocialMedia(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesPageEditor;
