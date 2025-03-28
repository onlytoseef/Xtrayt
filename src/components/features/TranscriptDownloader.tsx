
import React, { useState } from 'react';
import DownloaderInput from './DownloaderInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TranscriptDownloader = () => {
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [format, setFormat] = useState('txt');
  const [language, setLanguage] = useState('en');

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleDownload = (url: string) => {
    setProcessing(true);
    setTranscript(null);
    
    try {
      const videoId = getYouTubeVideoId(url);
      
      if (!videoId) {
        toast.error('Could not extract video ID from URL');
        setProcessing(false);
        return;
      }

      // In a real app, you would call a backend service to get transcript
      // For this demo, we'll simulate with comprehensive fake data
      setTimeout(() => {
        const fakeTranscript = `[00:00:00] Welcome to this YouTube video
[00:00:05] Today we're going to talk about an interesting topic
[00:00:10] Let's dive right in
[00:00:15] First point: technology is evolving rapidly
[00:00:20] Second point: we need to adapt to changes
[00:00:30] Third point: learning new skills is essential
[00:00:45] Fourth point: continuous learning is a mindset
[00:01:00] To summarize what we've discussed
[00:01:10] Thank you for watching
[00:01:15] Don't forget to like and subscribe
[00:01:20] Leave your comments below
[00:01:25] See you in the next video!`;
        
        setTranscript(fakeTranscript);
        setProcessing(false);
        toast.success('Transcript retrieved successfully');
      }, 1500);
      
    } catch (error) {
      toast.error('An error occurred while processing your request');
      setProcessing(false);
    }
  };

  const downloadTranscript = () => {
    if (!transcript) return;
    
    // Create file content based on selected format
    let content = transcript;
    let extension = format;
    let mimeType = 'text/plain';
    
    if (format === 'srt') {
      // Convert to SRT format
      content = transcript.split('\n').map((line, index) => {
        const parts = line.split('] ');
        if (parts.length !== 2) return '';
        const timeCode = parts[0].replace('[', '');
        const text = parts[1];
        return `${index + 1}\n${timeCode},000 --> ${timeCode},500\n${text}\n`;
      }).join('\n');
      mimeType = 'application/x-subrip';
    } else if (format === 'json') {
      // Convert to JSON format
      const jsonData = transcript.split('\n').map(line => {
        const parts = line.split('] ');
        if (parts.length !== 2) return null;
        const timeCode = parts[0].replace('[', '');
        const text = parts[1];
        return { time: timeCode, text };
      }).filter(Boolean);
      content = JSON.stringify(jsonData, null, 2);
      mimeType = 'application/json';
    }
    
    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const TranscriptOptions = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="txt">Plain Text (.txt)</SelectItem>
              <SelectItem value="srt">Subtitle (.srt)</SelectItem>
              <SelectItem value="json">JSON (.json)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="auto">Auto-detect</SelectItem>
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
            <FileText className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">YouTube Transcript Downloader</h2>
        <p className="text-muted-foreground">
          Extract and download video transcripts in various formats.
        </p>
      </div>
      
      <DownloaderInput 
        onSubmit={handleDownload}
        showOptions={true}
        options={TranscriptOptions}
        isProcessing={processing}
      />
      
      {transcript && (
        <Card className="mt-8 overflow-hidden hover-scale">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">Transcript Preview</h3>
                <Button onClick={downloadTranscript} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download as {format.toUpperCase()}
                </Button>
              </div>
              
              <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Formatted</TabsTrigger>
                  <TabsTrigger value="raw">Raw Text</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4">
                  <div className="bg-secondary p-4 rounded-lg max-h-[400px] overflow-y-auto">
                    {transcript.split('\n').map((line, index) => {
                      const parts = line.split('] ');
                      if (parts.length !== 2) return null;
                      
                      const timeCode = parts[0].replace('[', '');
                      const text = parts[1];
                      
                      return (
                        <div key={index} className="mb-3 flex">
                          <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded mr-3 whitespace-nowrap">
                            {timeCode}
                          </span>
                          <span className="text-sm">{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="raw" className="mt-4">
                  <pre className="bg-secondary p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-[400px] overflow-y-auto">
                    {transcript}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TranscriptDownloader;
