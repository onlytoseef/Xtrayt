
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DownloaderInputProps {
  onSubmit: (url: string, options?: any) => void;
  placeholder?: string;
  showOptions?: boolean;
  options?: React.ReactNode;
  isProcessing?: boolean;
  className?: string;
}

const DownloaderInput: React.FC<DownloaderInputProps> = ({
  onSubmit,
  placeholder = "Paste YouTube URL here...",
  showOptions = false,
  options,
  isProcessing = false,
  className,
}) => {
  const [url, setUrl] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    // Determine validation based on placeholder text
    const isTikTokInput = placeholder.toLowerCase().includes('tiktok');
    
    if (isTikTokInput) {
      // TikTok URL validation
      if (!url.includes('tiktok.com/')) {
        toast.error('Please enter a valid TikTok URL');
        return;
      }
    } else {
      // Default YouTube URL validation
      if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
        toast.error('Please enter a valid YouTube URL');
        return;
      }
    }
    
    onSubmit(url);
  };

  const handlePaste = () => {
    navigator.clipboard.readText()
      .then(text => {
        setUrl(text);
        if (showOptions) setExpanded(true);
        toast.success('URL pasted from clipboard');
      })
      .catch(() => {
        toast.error('Failed to read from clipboard');
      });
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-3xl mx-auto", className)}>
      <div className="input-wrapper group relative">
        <Input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (e.target.value && showOptions) setExpanded(true);
          }}
          placeholder={placeholder}
          className="pr-[175px]"
          disabled={isProcessing}
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePaste}
            className="text-xs"
            disabled={isProcessing}
          >
            Paste
          </Button>
          <Button 
            type="submit" 
            size="sm"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Download'}
          </Button>
        </div>
      </div>

      {showOptions && expanded && (
        <div className="mt-4 p-4 bg-secondary rounded-lg animate-fade-in">
          {options}
        </div>
      )}
    </form>
  );
};

export default DownloaderInput;
