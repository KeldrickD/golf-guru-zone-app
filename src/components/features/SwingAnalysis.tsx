'use client';

import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Camera, Play, Pause, RotateCcw, Download, Upload, Video } from 'lucide-react';

interface SwingAnalysisState {
  isRecording: boolean;
  recordedChunks: Blob[];
  videoUrl: string | null;
  playbackRate: number;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  showGuideLines: boolean;
  annotations: Array<{
    id: string;
    time: number;
    text: string;
    position: { x: number; y: number };
  }>;
}

export const SwingAnalysis = () => {
  const [state, setState] = useState<SwingAnalysisState>({
    isRecording: false,
    recordedChunks: [],
    videoUrl: null,
    playbackRate: 1,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    showGuideLines: false,
    annotations: [],
  });

  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStartRecording = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: true, recordedChunks: [] }));
    
    if (webcamRef.current) {
      const stream = webcamRef.current.video?.srcObject as MediaStream;
      if (stream) {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm',
        });
        
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.start();
      }
    }
  }, []);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
    }
  }, [state.isRecording]);

  const handleDataAvailable = useCallback(({ data }: BlobEvent) => {
    if (data.size > 0) {
      setState(prev => ({
        ...prev,
        recordedChunks: [...prev.recordedChunks, data],
        videoUrl: URL.createObjectURL(new Blob([data], { type: 'video/webm' })),
      }));
    }
  }, []);

  const handlePlaybackRateChange = useCallback((value: number) => {
    setState(prev => ({ ...prev, playbackRate: value }));
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setState(prev => ({
        ...prev,
        currentTime: videoRef.current?.currentTime || 0,
      }));
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (state.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  }, [state.isPlaying]);

  const handleDownload = useCallback(() => {
    if (state.videoUrl) {
      const a = document.createElement('a');
      a.href = state.videoUrl;
      a.download = 'golf-swing.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [state.videoUrl]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setState(prev => ({ ...prev, videoUrl: url }));
    }
  }, []);

  const toggleGuideLines = useCallback(() => {
    setState(prev => ({ ...prev, showGuideLines: !prev.showGuideLines }));
  }, []);

  const drawGuideLines = useCallback(() => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        if (state.showGuideLines) {
          // Draw vertical alignment line
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
          ctx.setLineDash([5, 5]);
          ctx.moveTo(canvasRef.current.width / 2, 0);
          ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height);
          ctx.stroke();

          // Draw horizontal plane line for hip level
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
          ctx.setLineDash([5, 5]);
          ctx.moveTo(0, canvasRef.current.height * 0.6);
          ctx.lineTo(canvasRef.current.width, canvasRef.current.height * 0.6);
          ctx.stroke();
        }

        // Draw annotations
        state.annotations.forEach(annotation => {
          if (Math.abs(state.currentTime - annotation.time) < 0.1) {
            ctx.fillStyle = 'yellow';
            ctx.font = '14px Arial';
            ctx.fillText(annotation.text, annotation.position.x, annotation.position.y);
          }
        });
      }
    }
  }, [state.showGuideLines, state.annotations, state.currentTime]);

  React.useEffect(() => {
    drawGuideLines();
  }, [drawGuideLines, state.currentTime]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Golf Swing Analysis</CardTitle>
        <CardDescription>
          Record and analyze your golf swing with professional tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {!state.videoUrl ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={state.videoUrl}
                    className="w-full"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={(e) => setState(prev => ({
                      ...prev,
                      duration: e.currentTarget.duration
                    }))}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {!state.videoUrl ? (
                <>
                  <Button
                    onClick={handleStartRecording}
                    disabled={state.isRecording}
                    variant={state.isRecording ? "secondary" : "default"}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {state.isRecording ? "Recording..." : "Start Recording"}
                  </Button>
                  <Button
                    onClick={handleStopRecording}
                    disabled={!state.isRecording}
                    variant="destructive"
                  >
                    Stop Recording
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handlePlayPause}>
                    {state.isPlaying ? (
                      <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    ) : (
                      <><Play className="mr-2 h-4 w-4" /> Play</>
                    )}
                  </Button>
                  <Button onClick={() => setState(prev => ({ ...prev, videoUrl: null }))}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Record New
                  </Button>
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={toggleGuideLines} variant="outline">
                    {state.showGuideLines ? "Hide Guidelines" : "Show Guidelines"}
                  </Button>
                </>
              )}
              <div className="relative">
                <Button variant="outline" asChild>
                  <label>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                    <Input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Playback Speed</Label>
              <Select
                value={state.playbackRate.toString()}
                onValueChange={(value) => handlePlaybackRateChange(parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select playback speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.25">0.25x</SelectItem>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {state.videoUrl && (
              <div className="space-y-4">
                <div>
                  <Label>Timeline</Label>
                  <Slider
                    value={[state.currentTime]}
                    min={0}
                    max={state.duration}
                    step={0.1}
                    onValueChange={([value]) => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = value;
                      }
                    }}
                  />
                </div>

                <Alert>
                  <Video className="h-4 w-4" />
                  <AlertTitle>Analysis Tips</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Use the guidelines to check your spine angle</li>
                      <li>Watch your head position throughout the swing</li>
                      <li>Analyze hip rotation at key positions</li>
                      <li>Check club path and face angle at impact</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 