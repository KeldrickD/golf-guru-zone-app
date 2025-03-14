'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/useToast';
import { Trophy, Share2, Camera, Download, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton, 
  WhatsappShareButton,
  FacebookIcon, 
  TwitterIcon, 
  LinkedinIcon, 
  WhatsappIcon
} from 'react-share';
import { formatDistance } from 'date-fns';

interface AchievementShareProps {
  title: string;
  description: string;
  date: Date | string;
  metrics?: {
    label: string;
    value: string | number;
  }[];
  imageUrl?: string;
  achievementType: 'personal_best' | 'milestone' | 'badge' | 'improvement';
}

const AchievementShare: React.FC<AchievementShareProps> = ({
  title,
  description,
  date,
  metrics = [],
  imageUrl,
  achievementType
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareableImage, setShareableImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get correct date format
  const displayDate = typeof date === 'string' ? new Date(date) : date;
  const formattedDate = formatDistance(displayDate, new Date(), { addSuffix: true });
  
  // Generate a shareable image from the card
  const generateImage = async () => {
    if (!cardRef.current) return;
    
    setIsGeneratingImage(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png');
      setShareableImage(image);
      
      toast({
        title: "Image generated!",
        description: "Your achievement is ready to share",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error generating image",
        description: "There was a problem creating your shareable image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  // Download the generated image
  const downloadImage = () => {
    if (!shareableImage) return;
    
    const link = document.createElement('a');
    link.href = shareableImage;
    link.download = `golf-achievement-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Image downloaded!",
      description: "Your achievement image has been saved",
    });
  };
  
  // Get the app URL for sharing
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${appUrl}/achievements/share?id=${encodeURIComponent(title)}`;
  const shareTitle = `I just ${achievementType === 'personal_best' ? 'achieved a personal best' : 
                       achievementType === 'milestone' ? 'reached a milestone' : 
                       achievementType === 'badge' ? 'earned a badge' : 
                       'made an improvement'} in golf: ${title}`;
                       
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1.5" 
        onClick={() => setIsOpen(true)}
      >
        <Share2 className="h-3.5 w-3.5" />
        <span>Share Achievement</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Share Your Achievement</DialogTitle>
            <DialogDescription>
              Create a shareable card with your golf achievement
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            {/* Achievement Card Preview */}
            <div ref={cardRef} className="p-4 bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-950/30 dark:to-sky-950/30 rounded-lg border shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                  <Trophy className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formattedDate}</div>
                </div>
              </div>
              
              {/* Metrics */}
              {metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {metrics.map((metric, i) => (
                    <div key={i} className="bg-white/70 dark:bg-gray-800/30 p-2 rounded">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</div>
                      <div className="font-semibold">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Golf Guru Zone watermark */}
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>Shared from</span>
                  <span className="font-semibold text-primary">Golf Guru Zone</span>
                </div>
              </div>
            </div>
            
            {/* Image generation and download */}
            <div className="flex flex-col gap-2">
              {!shareableImage ? (
                <Button 
                  variant="outline" 
                  onClick={generateImage} 
                  disabled={isGeneratingImage}
                  className="gap-2"
                >
                  {isGeneratingImage && <span className="animate-spin"><Loader2 className="h-4 w-4" /></span>}
                  <Camera className="h-4 w-4" />
                  <span>{isGeneratingImage ? 'Generating...' : 'Generate Image'}</span>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={downloadImage} 
                    className="flex-1 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShareableImage(null)} 
                    className="gap-2"
                  >
                    <span>Reset</span>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Social sharing buttons */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Share on social media</h4>
              <div className="flex flex-wrap gap-2">
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <div className="flex items-center gap-2 bg-[#1877f2] text-white p-2 rounded">
                    <FacebookIcon size={20} round />
                    <span className="text-sm">Facebook</span>
                  </div>
                </FacebookShareButton>
                
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <div className="flex items-center gap-2 bg-[#1da1f2] text-white p-2 rounded">
                    <TwitterIcon size={20} round />
                    <span className="text-sm">Twitter</span>
                  </div>
                </TwitterShareButton>
                
                <LinkedinShareButton url={shareUrl} title={shareTitle}>
                  <div className="flex items-center gap-2 bg-[#0a66c2] text-white p-2 rounded">
                    <LinkedinIcon size={20} round />
                    <span className="text-sm">LinkedIn</span>
                  </div>
                </LinkedinShareButton>
                
                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <div className="flex items-center gap-2 bg-[#25d366] text-white p-2 rounded">
                    <WhatsappIcon size={20} round />
                    <span className="text-sm">WhatsApp</span>
                  </div>
                </WhatsappShareButton>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AchievementShare; 