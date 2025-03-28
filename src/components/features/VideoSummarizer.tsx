
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Languages, Copy, FileDown, Search, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from 'react-markdown';
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
import { cn } from '@/lib/utils';
import { trackFeatureUsage } from '@/lib/analytics';

const VideoSummarizer = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [wordCount, setWordCount] = useState<number>(1500);
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [displayedScript, setDisplayedScript] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const scriptRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingIndexRef = useRef(0);

  useEffect(() => {
    if (generatedScript && loading === false) {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      
      setDisplayedScript('');
      typingIndexRef.current = 0;
      
      typingTimerRef.current = setInterval(() => {
        if (typingIndexRef.current < generatedScript.length) {
          setDisplayedScript(prev => prev + generatedScript.charAt(typingIndexRef.current));
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
  }, [generatedScript, loading]);

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

  const languages = [
    { id: 'english', name: 'English' },
    { id: 'urdu', name: 'Urdu' },
    { id: 'roman_urdu', name: 'Roman Urdu' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'punjabi', name: 'Punjabi' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'chinese', name: 'Chinese' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'russian', name: 'Russian' },
    { id: 'portuguese', name: 'Portuguese' },
    { id: 'italian', name: 'Italian' },
    { id: 'dutch', name: 'Dutch' },
    { id: 'turkish', name: 'Turkish' },
    { id: 'polish', name: 'Polish' },
    { id: 'swedish', name: 'Swedish' },
    { id: 'korean', name: 'Korean' },
    { id: 'vietnamese', name: 'Vietnamese' },
    { id: 'thai', name: 'Thai' },
    { id: 'bengali', name: 'Bengali' },
    { id: 'marathi', name: 'Marathi' },
    { id: 'tamil', name: 'Tamil' },
    { id: 'telugu', name: 'Telugu' },
    { id: 'malay', name: 'Malay' },
    { id: 'indonesian', name: 'Indonesian' },
    { id: 'persian', name: 'Persian' },
    { id: 'hebrew', name: 'Hebrew' },
    { id: 'greek', name: 'Greek' },
    { id: 'norwegian', name: 'Norwegian' },
    { id: 'danish', name: 'Danish' },
    { id: 'finnish', name: 'Finnish' },
    { id: 'czech', name: 'Czech' },
    { id: 'hungarian', name: 'Hungarian' },
    { id: 'romanian', name: 'Romanian' },
    { id: 'bulgarian', name: 'Bulgarian' },
    { id: 'ukrainian', name: 'Ukrainian' },
    { id: 'swahili', name: 'Swahili' },
    { id: 'zulu', name: 'Zulu' },
    { id: 'xhosa', name: 'Xhosa' },
    { id: 'afrikaans', name: 'Afrikaans' },
    { id: 'nepali', name: 'Nepali' },
    { id: 'sinhalese', name: 'Sinhalese' },
    { id: 'khmer', name: 'Khmer' },
    { id: 'mongolian', name: 'Mongolian' },
    { id: 'tagalog', name: 'Tagalog' },
    { id: 'filipino', name: 'Filipino' },
    { id: 'javanese', name: 'Javanese' },
    { id: 'burmese', name: 'Burmese' },
    { id: 'latvian', name: 'Latvian' },
    { id: 'lithuanian', name: 'Lithuanian' },
    { id: 'estonian', name: 'Estonian' },
    { id: 'slovak', name: 'Slovak' },
    { id: 'slovenian', name: 'Slovenian' },
    { id: 'albanian', name: 'Albanian' },
    { id: 'croatian', name: 'Croatian' },
    { id: 'serbian', name: 'Serbian' },
    { id: 'bosnian', name: 'Bosnian' },
    { id: 'macedonian', name: 'Macedonian' },
    { id: 'georgian', name: 'Georgian' },
    { id: 'armenian', name: 'Armenian' },
    { id: 'azerbaijani', name: 'Azerbaijani' },
    { id: 'kazakh', name: 'Kazakh' },
    { id: 'uzbek', name: 'Uzbek' },
    { id: 'turkmen', name: 'Turkmen' },
    { id: 'kyrgyz', name: 'Kyrgyz' },
    { id: 'tajik', name: 'Tajik' },
    { id: 'pashto', name: 'Pashto' },
    { id: 'icelandic', name: 'Icelandic' },
    { id: 'maltese', name: 'Maltese' }
  ];

  const filteredLanguages = searchQuery 
    ? languages.filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : languages;

  const generateVideoScript = async () => {
    setLoading(true);
    setGeneratedScript('');
    setDisplayedScript('');
    const startTime = performance.now();
    
    try {
      const apiKey = 'AIzaSyAlSYzq5UxQY5oyAhXOmgi_dsubqOKeGoU';
      
      let prompt = `Generate a comprehensive video script that starts with a strong hook. Use engaging language and ensure the script maintains viewer interest throughout. The script should be EXACTLY ${wordCount} WORDS LONG (not more, not less).`;
      
      if (videoTitle || videoDescription) {
        prompt += `\n\nContext:`;
        if (videoTitle) prompt += `\nTitle: ${videoTitle}`;
        if (videoDescription) prompt += `\nDescription: ${videoDescription}`;
      }
      
      prompt += `\n\nThe script should be in ${selectedLanguage} and MUST be EXACTLY ${wordCount} words long. This is a STRICT requirement - the script CANNOT be more or less than ${wordCount} words. Use extensive details, examples, and storytelling to reach this length. Include clear transitions, engaging storytelling elements, and a strong call to action at the end.`;
      
      prompt += `\n\nREMINDER: The output MUST be EXACTLY ${wordCount} words. This is a hard requirement - please count and ensure the output meets this exact length before finishing.`;

      console.log("Sending prompt to Gemini:", prompt);
      
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
            temperature: 1.0,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        })
      });

      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.error) {
        throw new Error(data.error.message || "API error occurred");
      }
      
      let script = '';
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        script = data.candidates[0].content.parts[0].text.trim();
      } else if (data.candidates && data.candidates.length === 0) {
        throw new Error("The model was unable to generate a script. Please try with different inputs.");
      }
      
      if (!script) {
        throw new Error("Failed to generate video script");
      }
      
      const endTime = performance.now();
      setGenerationTime(Math.round(endTime - startTime));
      
      setGeneratedScript(script);
      
      try {
        trackFeatureUsage('video-script-generator', 'generate');
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
      
      toast({
        title: "Script generated!",
        description: `Your video script is ready below. Generated in ${Math.round(endTime - startTime)}ms.`,
      });
      
    } catch (error) {
      console.error('Error generating video script:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Script copied to clipboard",
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

  const downloadScript = (format: 'txt' | 'docx' | 'pdf' | 'md' | 'html') => {
    if (!generatedScript) return;
    
    let content = generatedScript;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    switch (format) {
      case 'html':
        content = `<!DOCTYPE html>
<html>
<head>
    <title>${videoTitle || 'Video Script'}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #333; }
        p { margin-bottom: 16px; }
    </style>
</head>
<body>
    <h1>${videoTitle || 'Video Script'}</h1>
    ${generatedScript.split('\n').map(line => `<p>${line}</p>`).join('')}
</body>
</html>`;
        mimeType = 'text/html';
        extension = 'html';
        break;
      
      case 'md':
        content = `# ${videoTitle || 'Video Script'}\n\n${generatedScript}`;
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      
      case 'docx':
        content = generatedScript;
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
        content = generatedScript;
        mimeType = 'text/plain';
        extension = 'txt';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle ? videoTitle.replace(/\s+/g, '-').toLowerCase() : 'video'}-script.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `Your script has been downloaded as ${extension.toUpperCase()}`,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-6 relative">
      <div className="flex-1 lg:max-w-md glass-panel p-6 sticky top-24 self-start rounded-xl bg-card/60 backdrop-blur-sm border shadow-md">
        <div className="space-y-6">
          {/* Input fields section */}
          <div className="space-y-2">
            <Label htmlFor="videoTitle" className="text-sm font-medium">
              Video Title (Optional)
            </Label>
            <Input
              id="videoTitle"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter a title for your video"
              className="w-full bg-background/50 border-border/50"
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
              placeholder="Describe what your video is about"
              className="w-full min-h-[100px] resize-y bg-background/50 border-border/50"
            />
          </div>
          
          <div className="space-y-6">
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
                        autoComplete="off"
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
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="wordCount" className="text-sm font-medium">
                  Word Count
                </Label>
                <span className="text-sm text-muted-foreground">{wordCount} words</span>
              </div>
              <Slider
                id="wordCount"
                min={500}
                max={3000}
                step={500}
                value={[wordCount]}
                onValueChange={(values) => setWordCount(values[0])}
                className="w-full"
              />
            </div>
          </div>
          
          <Button 
            onClick={generateVideoScript}
            disabled={loading}
            className="w-full py-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              'Generate Video Script'
            )}
          </Button>
          
          {loading && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Generating script...</span>
                <span>{Math.min(Math.round(progress), 100)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {generationTime !== null && !loading && (
            <div className="text-xs text-muted-foreground text-center mt-2">
              Generated in {generationTime}ms
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        {generatedScript || loading ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Your Video Script</h3>
              {generatedScript && !loading && (
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
                      <DropdownMenuItem onClick={() => downloadScript('txt')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Text (.txt)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadScript('md')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Markdown (.md)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadScript('html')}>
                        <FileText className="h-4 w-4 mr-2" />
                        HTML (.html)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadScript('docx')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Word (.docx)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadScript('pdf')}>
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
                  <p className="text-muted-foreground text-sm">Crafting your script...</p>
                </div>
              ) : (
                <div ref={scriptRef}>
                  <ReactMarkdown className="text-base leading-relaxed prose dark:prose-invert max-w-none">
                    {displayedScript}
                  </ReactMarkdown>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <div className="h-[500px] flex items-center justify-center p-12 bg-card/60 backdrop-blur-sm border rounded-xl shadow-md">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Fill in the details and generate your script</p>
              <p className="text-sm mt-2">Your generated script will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSummarizer;
