import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogOut, Key, Settings, Globe, Tag, BarChart, Users, FileText, Layout, Image, Info, Share2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOKeywordsManager from '@/components/admin/SEOKeywordsManager';
import ServicesPageEditor from '@/components/admin/ServicesPageEditor';
import AboutPageEditor from '@/components/admin/AboutPageEditor';
import HomePageEditor from '@/components/admin/HomePageEditor';
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('api-keys');
  
  // Get API settings
  const [apiSettings, setApiSettings] = useState({
    youtubeTagsAPI: {
      key: ""
    },
    googleOAuth: {
      clientId: ""
    },
    tiktokAPI: {
      key: ""
    }
  });
  
  const [isLoadingAPISettings, setIsLoadingAPISettings] = useState(true);
  const [apiSettingsId, setApiSettingsId] = useState<string | null>(null);
  
  const [analyticsPeriod, setAnalyticsPeriod] = useState('week');
  const [usersFilter, setUsersFilter] = useState('all');

  // Social media links state
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    facebook: ""
  });
  
  const [isLoadingSocialLinks, setIsLoadingSocialLinks] = useState(true);
  const [socialLinksId, setSocialLinksId] = useState<string | null>(null);

  useEffect(() => {
    // Load API settings from localStorage
    const loadApiSettings = async () => {
      setIsLoadingAPISettings(true);
      try {
        // Try to load from localStorage
        const storedSettings = localStorage.getItem('adminApiSettings');
        if (storedSettings) {
          setApiSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error("Error loading API settings:", error);
        toast.error("Failed to load API settings");
      } finally {
        setIsLoadingAPISettings(false);
      }
    };
    
    // Load social media links from localStorage
    const loadSocialLinks = async () => {
      setIsLoadingSocialLinks(true);
      try {
        // Try to load from localStorage
        const storedLinks = localStorage.getItem('adminSocialLinks');
        if (storedLinks) {
          setSocialLinks(JSON.parse(storedLinks));
        }
      } catch (error) {
        console.error("Error loading social media links:", error);
        toast.error("Failed to load social media links");
      } finally {
        setIsLoadingSocialLinks(false);
      }
    };
    
    loadApiSettings();
    loadSocialLinks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const updateApiSetting = (category: string, field: string, value: string) => {
    setApiSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const saveApiSettings = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('adminApiSettings', JSON.stringify(apiSettings));
      console.log("API settings saved to localStorage:", apiSettings);
      toast.success('API settings saved successfully');
    } catch (error) {
      console.error("Failed to save API settings:", error);
      toast.error('Failed to save API settings');
    }
  };

  const saveSocialLinks = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('adminSocialLinks', JSON.stringify(socialLinks));
      console.log("Social links saved to localStorage:", socialLinks);
      toast.success('Social media links saved successfully');
    } catch (error) {
      console.error("Failed to save social media links:", error);
      toast.error('Failed to save social media links');
    }
  };

  // Mock analytics data
  const analyticsData = {
    totalVisits: 12458,
    uniqueVisitors: 4532,
    pageViews: 28974,
    averageSessionDuration: '2m 34s',
    bounceRate: '32.8%',
    topPages: [
      { page: 'Home', views: 4856 },
      { page: 'Video Downloader', views: 3245 },
      { page: 'Thumbnail Downloader', views: 2912 },
      { page: 'Transcript Tool', views: 1876 },
      { page: 'TikTok Downloader', views: 1543 }
    ]
  };

  // Mock users data
  const usersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', lastActive: '2025-03-18', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', lastActive: '2025-03-17', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', lastActive: '2025-03-15', status: 'inactive' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', lastActive: '2025-03-16', status: 'active' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', lastActive: '2025-03-14', status: 'inactive' }
  ];

  return (
    <div className="container mx-auto py-24 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="social-media" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            SEO Settings
          </TabsTrigger>
          <TabsTrigger value="home-page" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home Page
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Services Page
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            About Page
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                API Settings
              </CardTitle>
              <CardDescription>
                Manage API keys and credentials for different services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* YouTube Tags API */}
              <div className="space-y-2">
                <Label htmlFor="youtube-api-key">YouTube Tags API Key</Label>
                <Input 
                  id="youtube-api-key"
                  value={apiSettings.youtubeTagsAPI.key}
                  onChange={(e) => updateApiSetting('youtubeTagsAPI', 'key', e.target.value)}
                  placeholder="Enter YouTube Data API Key"
                />
                <p className="text-xs text-muted-foreground">
                  Used for extracting tags from YouTube videos.
                </p>
              </div>

              {/* Google OAuth */}
              <div className="space-y-2">
                <Label htmlFor="google-client-id">Google OAuth Client ID</Label>
                <Input 
                  id="google-client-id"
                  value={apiSettings.googleOAuth.clientId}
                  onChange={(e) => updateApiSetting('googleOAuth', 'clientId', e.target.value)}
                  placeholder="Enter Google OAuth Client ID"
                />
                <p className="text-xs text-muted-foreground">
                  Used for Google sign-in authentication.
                </p>
              </div>

              {/* TikTok API */}
              <div className="space-y-2">
                <Label htmlFor="tiktok-api-key">TikTok API Key</Label>
                <Input 
                  id="tiktok-api-key"
                  value={apiSettings.tiktokAPI.key}
                  onChange={(e) => updateApiSetting('tiktokAPI', 'key', e.target.value)}
                  placeholder="Enter TikTok API Key"
                />
                <p className="text-xs text-muted-foreground">
                  Used for downloading TikTok videos.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveApiSettings} className="ml-auto">
                <Settings className="h-4 w-4 mr-2" />
                Save API Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social-media" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Manage social media links that appear in the website footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="github-link">GitHub Link</Label>
                <Input 
                  id="github-link"
                  value={socialLinks.github}
                  onChange={(e) => updateSocialLink('github', e.target.value)}
                  placeholder="Enter GitHub profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter-link">Twitter Link</Label>
                <Input 
                  id="twitter-link"
                  value={socialLinks.twitter}
                  onChange={(e) => updateSocialLink('twitter', e.target.value)}
                  placeholder="Enter Twitter profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram-link">Instagram Link</Label>
                <Input 
                  id="instagram-link"
                  value={socialLinks.instagram}
                  onChange={(e) => updateSocialLink('instagram', e.target.value)}
                  placeholder="Enter Instagram profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin-link">LinkedIn Link</Label>
                <Input 
                  id="linkedin-link"
                  value={socialLinks.linkedin}
                  onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                  placeholder="Enter LinkedIn profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook-link">Facebook Link</Label>
                <Input 
                  id="facebook-link"
                  value={socialLinks.facebook}
                  onChange={(e) => updateSocialLink('facebook', e.target.value)}
                  placeholder="Enter Facebook profile URL"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSocialLinks} className="ml-auto">
                <Settings className="h-4 w-4 mr-2" />
                Save Social Media Links
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SEO Settings Tab */}
        <TabsContent value="seo" className="mt-6">
          <SEOKeywordsManager />
        </TabsContent>

        {/* Home Page Editor Tab */}
        <TabsContent value="home-page" className="mt-6">
          <HomePageEditor />
        </TabsContent>

        {/* Services Page Editor Tab */}
        <TabsContent value="services" className="mt-6">
          <ServicesPageEditor />
        </TabsContent>

        {/* About Page Editor Tab */}
        <TabsContent value="about" className="mt-6">
          <AboutPageEditor />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Website Analytics
              </CardTitle>
              <CardDescription>
                View performance metrics and website statistics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Visits</div>
                  <div className="text-2xl font-bold mt-1">{analyticsData.totalVisits.toLocaleString()}</div>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Unique Visitors</div>
                  <div className="text-2xl font-bold mt-1">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Page Views</div>
                  <div className="text-2xl font-bold mt-1">{analyticsData.pageViews.toLocaleString()}</div>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Bounce Rate</div>
                  <div className="text-2xl font-bold mt-1">{analyticsData.bounceRate}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Top Pages</h3>
                <div className="space-y-2">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <span>{page.page}</span>
                      <span className="font-medium">{page.views.toLocaleString()} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage registered users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Last Active</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.map(user => (
                      <tr key={user.id} className="border-b hover:bg-secondary/50">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.lastActive}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
