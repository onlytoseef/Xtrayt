
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface AboutPageContent {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  teamMembers: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

const defaultAboutContent: AboutPageContent = {
  title: "About YTube Tool",
  subtitle: "Making YouTube content creation easier",
  description: "YTube Tool provides simple yet powerful tools for YouTube content creators to optimize their videos and improve their channel performance.",
  mission: "Our mission is to help content creators succeed by providing them with accessible tools that simplify their workflow.",
  vision: "We envision a future where content creators can focus on what they do best - creating amazing content - while we handle the technical aspects.",
  teamMembers: [
    {
      id: "1",
      name: "Ali Usman",
      role: "Founder & CEO",
      bio: "Ali founded YTube Tool with a passion for helping content creators succeed.",
      imageUrl: "/placeholder.svg"
    }
  ]
};

const AboutPageEditor: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<AboutPageContent>(defaultAboutContent);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved about page content from localStorage on component mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('aboutPageContent');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        setAboutContent(parsedContent);
      }
    } catch (error) {
      console.error('Error loading about page content:', error);
      toast.error('Failed to load about page content');
    }
  }, []);

  const handleContentChange = (field: keyof AboutPageContent, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "New Team Member",
      role: "Role",
      bio: "Bio information",
      imageUrl: "/placeholder.svg"
    };
    
    setAboutContent(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember]
    }));
  };

  const handleRemoveTeamMember = (id: string) => {
    setAboutContent(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };

  const handleTeamMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('aboutPageContent', JSON.stringify(aboutContent));
      toast.success('About page content saved successfully');
    } catch (error) {
      console.error('Error saving about page content:', error);
      toast.error('Failed to save about page content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Page Editor</CardTitle>
        <CardDescription>
          Customize the content of your About page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Page Content</h3>
          
          <div className="space-y-2">
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              value={aboutContent.title}
              onChange={(e) => handleContentChange('title', e.target.value)}
              placeholder="Page title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page-subtitle">Subtitle</Label>
            <Input
              id="page-subtitle"
              value={aboutContent.subtitle}
              onChange={(e) => handleContentChange('subtitle', e.target.value)}
              placeholder="Page subtitle"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page-description">Main Description</Label>
            <Textarea
              id="page-description"
              value={aboutContent.description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              placeholder="Main page description"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page-mission">Mission Statement</Label>
            <Textarea
              id="page-mission"
              value={aboutContent.mission}
              onChange={(e) => handleContentChange('mission', e.target.value)}
              placeholder="Mission statement"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page-vision">Vision Statement</Label>
            <Textarea
              id="page-vision"
              value={aboutContent.vision}
              onChange={(e) => handleContentChange('vision', e.target.value)}
              placeholder="Vision statement"
              rows={3}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Team Members</h3>
            <Button 
              onClick={handleAddTeamMember} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Team Member
            </Button>
          </div>
          
          {aboutContent.teamMembers.map((member) => (
            <Card key={member.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-destructive"
                onClick={() => handleRemoveTeamMember(member.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden bg-secondary">
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Label 
                        htmlFor={`upload-${member.id}`} 
                        className="cursor-pointer bg-background/80 p-1 rounded-full"
                      >
                        <Upload className="h-4 w-4" />
                        <Input
                          id={`upload-${member.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                handleTeamMemberChange(member.id, 'imageUrl', reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Input
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                      placeholder="Name"
                    />
                    <Input
                      value={member.role}
                      onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                      placeholder="Role"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`bio-${member.id}`}>Bio</Label>
                  <Textarea
                    id={`bio-${member.id}`}
                    value={member.bio}
                    onChange={(e) => handleTeamMemberChange(member.id, 'bio', e.target.value)}
                    placeholder="Team member bio"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`image-${member.id}`}>Image URL (or upload above)</Label>
                  <Input
                    id={`image-${member.id}`}
                    value={member.imageUrl}
                    onChange={(e) => handleTeamMemberChange(member.id, 'imageUrl', e.target.value)}
                    placeholder="Image URL"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

export default AboutPageEditor;
