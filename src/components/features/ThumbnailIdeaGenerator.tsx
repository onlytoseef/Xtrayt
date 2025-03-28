
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Languages, Search, FileText, Copy, FileDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { trackFeatureUsage } from '@/lib/analytics';

const ThumbnailIdeaGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoScript, setVideoScript] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState<string>('');
  const [displayedIdea, setDisplayedIdea] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(0);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingIndexRef = useRef(0);

  const languages = [
    { id: 'english', name: 'English' },
    { id: 'urdu', name: 'Urdu' },
    { id: 'roman_urdu', name: 'Roman Urdu' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'chinese', name: 'Chinese' },
    { id: 'russian', name: 'Russian' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'portuguese', name: 'Portuguese' },
    { id: 'italian', name: 'Italian' },
    { id: 'dutch', name: 'Dutch' },
    { id: 'turkish', name: 'Turkish' },
    { id: 'polish', name: 'Polish' },
    { id: 'swedish', name: 'Swedish' },
    { id: 'korean', name: 'Korean' },
    { id: 'vietnamese', name: 'Vietnamese' },
    { id: 'thai', name: 'Thai' },
  ];

  const filteredLanguages = searchQuery 
    ? languages.filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : languages;

  const generateThumbnailIdeas = async () => {
    if (!videoTitle.trim()) {
      toast({
        title: "Video title is required",
        description: "Please enter a video title to generate thumbnail ideas.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedIdea('');
    setDisplayedIdea('');
    setGenerationTime(null);
    const startTime = performance.now();
    
    try {
      trackFeatureUsage('thumbnail_idea_generator', 'generate');
      
      const apiKey = 'AIzaSyAlSYzq5UxQY5oyAhXOmgi_dsubqOKeGoU';
      const prompt = `Generate ONE DETAILED thumbnail idea for a YouTube video with the following details:
Title: ${videoTitle}
${videoScript ? `Script: ${videoScript}` : ''}
${videoDescription ? `Description: ${videoDescription}` : ''}

The idea should be detailed, descriptive, and engaging, focusing on visual elements that would make viewers click. Include details about what text, images, colors, and expressions should be in the thumbnail.

IMPORTANT CONSTRAINTS:
1. Maximum length: 200 words
2. Return the response in ${selectedLanguage} language
3. You can use markdown formatting for emphasis, such as **bold** for important elements and *italic* for additional styling details.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
        })
      });

      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.error) {
        throw new Error(data.error.message || "API error occurred");
      }
      
      let idea = '';
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        idea = data.candidates[0].content.parts[0].text.trim();
        
        idea = idea.replace(/^(Idea|Thumbnail)(\s*\d*)?[:.]\s*/i, '');
      }
      
      if (!idea) {
        throw new Error("Failed to generate thumbnail idea");
      }

      const endTime = performance.now();
      setGeneratedIdea(idea);
      setGenerationTime(Math.round(endTime - startTime));
      
      toast({
        title: "Idea generated!",
        description: "Check out your detailed thumbnail idea below.",
      });
      
    } catch (error) {
      console.error('Error generating thumbnail idea:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate thumbnail idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedIdea) return;
    navigator.clipboard.writeText(generatedIdea)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Thumbnail idea copied to clipboard",
        });
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "Couldn't copy to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  };

  const downloadIdea = (format: 'txt' | 'md' | 'html' | 'docx' | 'pdf') => {
    if (!generatedIdea) return;
    
    let content = generatedIdea;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    switch (format) {
      case 'html':
        content = `<!DOCTYPE html>
<html>
<head>
    <title>${videoTitle || 'Thumbnail Idea'}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #333; }
        p { margin-bottom: 16px; }
    </style>
</head>
<body>
    <h1>${videoTitle || 'Thumbnail Idea'}</h1>
    ${generatedIdea.split('\n').map(line => `<p>${line}</p>`).join('')}
</body>
</html>`;
        mimeType = 'text/html';
        extension = 'html';
        break;
      
      case 'md':
        content = `# ${videoTitle || 'Thumbnail Idea'}\n\n${generatedIdea}`;
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      
      case 'docx':
        content = generatedIdea;
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        extension = 'docx';
        break;
      
      case 'pdf':
        toast({
          title: "PDF Generation",
          description: "To create a PDF, download as HTML and print to PDF from your browser.",
        });
        return;
      
      default:
        content = generatedIdea;
        mimeType = 'text/plain';
        extension = 'txt';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle ? videoTitle.replace(/\s+/g, '-').toLowerCase() : 'thumbnail'}-idea.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `Your thumbnail idea has been downloaded as ${extension.toUpperCase()}`,
    });
  };

  useEffect(() => {
    if (generatedIdea && loading === false) {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      
      setDisplayedIdea('');
      typingIndexRef.current = 0;
      
      typingTimerRef.current = setInterval(() => {
        if (typingIndexRef.current < generatedIdea.length) {
          setDisplayedIdea(prev => prev + generatedIdea.charAt(typingIndexRef.current));
          typingIndexRef.current++;
        } else {
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
        }
      }, 10);
    }
    
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [generatedIdea, loading]);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    
    if (loading) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            return prev;
          }
          return prev + (95 - prev) * 0.05;
        });
      }, 300);
    } else {
      setProgress(100);
    }
    
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [loading]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-6 relative">
      <div className="flex-1 lg:max-w-md glass-panel p-6 sticky top-24 self-start rounded-xl bg-card/60 backdrop-blur-sm border shadow-md">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="videoTitle" className="text-sm font-medium">
              Video Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="videoTitle"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter the title of your video"
              className="w-full bg-background/50 border-border/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoScript" className="text-sm font-medium">
              Video Script (Optional)
            </Label>
            <Textarea
              id="videoScript"
              value={videoScript}
              onChange={(e) => setVideoScript(e.target.value)}
              placeholder="Enter key points from your video script"
              className="min-h-[100px] w-full resize-y bg-background/50 border-border/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoDescription" className="text-sm font-medium">
              Video Description (Optional)
            </Label>
            <Textarea
              id="videoDescription"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Enter your video description"
              className="min-h-[100px] w-full resize-y bg-background/50 border-border/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium">
              Language
            </Label>
            <div className="flex items-center space-x-2">
              <Languages className="w-5 h-5 text-muted-foreground" />
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-full bg-background/50 border-border/50">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex items-center px-2 pb-1">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search language..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className={cn("max-h-[300px] overflow-y-auto", filteredLanguages.length > 10 ? "pr-2" : "")}>
                    {filteredLanguages.map((language) => (
                      <SelectItem key={language.id} value={language.id}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={generateThumbnailIdeas}
            disabled={loading || !videoTitle.trim()}
            className="w-full py-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Idea...
              </>
            ) : (
              'Generate Thumbnail Idea'
            )}
          </Button>
          
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Generating...</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        {(generatedIdea || loading) ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Your Thumbnail Idea</h3>
              {generatedIdea && !loading && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => downloadIdea('txt')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Text (.txt)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadIdea('md')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Markdown (.md)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadIdea('html')}>
                        <FileText className="h-4 w-4 mr-2" />
                        HTML (.html)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadIdea('docx')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Word (.docx)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadIdea('pdf')}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            
            <Card className="p-6 shadow-md bg-background/80 backdrop-blur-sm border-border/50 rounded-xl h-[500px] overflow-y-auto">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex space-x-2">
                    <motion.div
                      className="h-3 w-3 rounded-full bg-primary"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                    />
                    <motion.div
                      className="h-3 w-3 rounded-full bg-primary"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    />
                    <motion.div
                      className="h-3 w-3 rounded-full bg-primary"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">Crafting your thumbnail idea...</p>
                </div>
              ) : (
                <>
                  <ReactMarkdown className="text-base leading-relaxed prose dark:prose-invert max-w-none">
                    {displayedIdea}
                  </ReactMarkdown>
                  {generationTime !== null && (
                    <div className="mt-4 text-xs text-muted-foreground text-right">
                      Generated in {generationTime.toLocaleString()} ms
                    </div>
                  )}
                </>
              )}
            </Card>
          </motion.div>
        ) : (
          <div className="h-[500px] flex items-center justify-center p-12 bg-card/60 backdrop-blur-sm border rounded-xl shadow-md">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Fill in the details and generate your thumbnail idea</p>
              <p className="text-sm mt-2">Your generated idea will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailIdeaGenerator;
