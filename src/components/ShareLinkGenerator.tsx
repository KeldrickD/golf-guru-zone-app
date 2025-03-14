'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/components/ui/useToast';
import { Loader2, Share2, Copy, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton, 
  EmailShareButton
} from 'react-share';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar';
import { CalendarIcon, ShareIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  FacebookIcon, TwitterIcon, LinkedinIcon, EmailIcon 
} from 'react-share';

interface ShareableContent {
  contentType: 'round' | 'goal' | 'stats';
  title: string;
  description?: string;
  roundId?: string;
  goalId?: string;
  statsTimeframe?: string;
  customData?: any;
  expiresAt?: string;
  isPublic: boolean;
}

interface SharedContentResponse {
  sharedContent: {
    id: string;
    shareId: string;
    title: string;
    description?: string;
    contentType: string;
    isPublic: boolean;
    viewCount: number;
    createdAt: string;
  };
  shareUrl: string;
}

interface ShareLinkGeneratorProps {
  contentType: 'round' | 'goal' | 'stats';
  contentId?: string;
  title?: string;
  description?: string;
  timeframe?: string;
  customData?: any;
}

const ShareLinkGenerator: React.FC<ShareLinkGeneratorProps> = ({
  contentType,
  contentId,
  title: initialTitle = '',
  description: initialDescription = '',
  timeframe,
  customData
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [shareableContent, setShareableContent] = useState<ShareableContent>({
    contentType,
    title: initialTitle || `My Golf ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`,
    description: initialDescription,
    isPublic: true,
  });
  const [generatedLink, setGeneratedLink] = useState<SharedContentResponse | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<string>('link');
  
  // Set the appropriate ID based on content type
  useEffect(() => {
    if (contentId) {
      if (contentType === 'round') {
        setShareableContent(prev => ({ ...prev, roundId: contentId }));
      } else if (contentType === 'goal') {
        setShareableContent(prev => ({ ...prev, goalId: contentId }));
      }
    }
    
    if (timeframe && contentType === 'stats') {
      setShareableContent(prev => ({ ...prev, statsTimeframe: timeframe }));
    }
    
    if (customData) {
      setShareableContent(prev => ({ ...prev, customData }));
    }
  }, [contentId, contentType, timeframe, customData]);
  
  // Generate QR Code when link is created
  useEffect(() => {
    if (generatedLink?.shareUrl) {
      generateQRCode(generatedLink.shareUrl);
    }
  }, [generatedLink]);
  
  const generateQRCode = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#4f46e5',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };
  
  const generateShareableLink = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...shareableContent,
          expiresAt: expiryDate?.toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate sharing link');
      }
      
      const data = await response.json();
      setGeneratedLink(data);
      
      toast({
        title: 'Share link created',
        description: 'Your shareable link has been generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate sharing link',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyLink = () => {
    if (generatedLink?.shareUrl) {
      navigator.clipboard.writeText(generatedLink.shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };
  
  const handleExpiryChange = (date?: Date) => {
    setExpiryDate(date);
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <ShareIcon className="h-4 w-4" />
        Share
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Your Golf {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</DialogTitle>
            <DialogDescription>
              Create a shareable link to show off your golf performance.
            </DialogDescription>
          </DialogHeader>
          
          {!generatedLink ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={shareableContent.title} 
                  onChange={(e) => setShareableContent({...shareableContent, title: e.target.value})}
                  placeholder="Enter a title for sharing"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={shareableContent.description || ''} 
                  onChange={(e) => setShareableContent({...shareableContent, description: e.target.value})}
                  placeholder="Add a description (optional)"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="public-toggle">Public</Label>
                  <Switch
                    id="public-toggle"
                    checked={shareableContent.isPublic}
                    onCheckedChange={(checked) => setShareableContent({...shareableContent, isPublic: checked})}
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : "Set expiration date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={handleExpiryChange}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                    {expiryDate && (
                      <div className="flex justify-end p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpiryDate(undefined)}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={generateShareableLink} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Shareable Link"}
                </Button>
              </div>
            </div>
          ) : (
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Link & QR Code</TabsTrigger>
                <TabsTrigger value="share">Social Share</TabsTrigger>
              </TabsList>
              
              <TabsContent value="link" className="space-y-4 pt-4">
                <div className="flex space-x-2">
                  <Input value={generatedLink.shareUrl} readOnly />
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    {showCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex justify-center p-4">
                  {qrCodeUrl && (
                    <div className="flex flex-col items-center space-y-2">
                      <img src={qrCodeUrl} alt="QR Code" width={200} height={200} />
                      <span className="text-sm text-muted-foreground">Scan to view content</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-2 text-center text-sm text-muted-foreground">
                  {shareableContent.isPublic 
                    ? "Anyone with this link can view this content" 
                    : "Only registered users can view this content"}
                  {expiryDate && (
                    <div>Expires on {format(expiryDate, "PPP")}</div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="share" className="space-y-4 pt-4">
                <div className="flex justify-center space-x-4 py-4">
                  <FacebookShareButton 
                    url={generatedLink.shareUrl}
                    quote={shareableContent.title}
                  >
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>
                  
                  <TwitterShareButton 
                    url={generatedLink.shareUrl}
                    title={shareableContent.title}
                  >
                    <TwitterIcon size={40} round />
                  </TwitterShareButton>
                  
                  <LinkedinShareButton 
                    url={generatedLink.shareUrl}
                    title={shareableContent.title}
                    summary={shareableContent.description || 'Check out my golf stats!'}
                  >
                    <LinkedinIcon size={40} round />
                  </LinkedinShareButton>
                  
                  <EmailShareButton 
                    url={generatedLink.shareUrl}
                    subject={`Golf stats from Golf Guru Zone: ${shareableContent.title}`}
                    body={shareableContent.description || 'Check out my golf stats!'}
                  >
                    <EmailIcon size={40} round />
                  </EmailShareButton>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-sm text-muted-foreground text-center">
                    Share this link with friends and fellow golfers to showcase your performance!
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareLinkGenerator; 