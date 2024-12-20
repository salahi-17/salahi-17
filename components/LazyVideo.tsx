    // components/LazyVideo/LazyVideo.tsx
    import React, { useState, useEffect, useRef } from 'react';
    import { Skeleton } from "@/components/ui/skeleton";
    import { cn } from "@/lib/utils";
    import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
    import { Slider } from "@/components/ui/slider";

    interface LazyVideoProps {
    src: string;
    className?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    }

    export default function LazyVideo({ 
    src, 
    className,
    autoPlay = false,
    loop = true,
    muted = false
    }: LazyVideoProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        let isMounted = true;

        const loadVideo = async () => {
        try {
            // Check cache first
            const cachedVideo = localStorage.getItem(`video_cache_${src}`);
            if (cachedVideo) {
            if (isMounted) {
                setVideoSrc(cachedVideo);
                setIsLoading(false);
            }
            return;
            }

            // Load video
            const response = await fetch(src);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            
            if (isMounted) {
            setVideoSrc(objectUrl);
            setIsLoading(false);
            
            // Cache the video
            try {
                localStorage.setItem(`video_cache_${src}`, objectUrl);
            } catch (error) {
                console.warn('Failed to cache video:', error);
            }
            }
        } catch (error) {
            console.error('Error loading video:', error);
            if (isMounted) {
            setIsLoading(false);
            }
        }
        };

        loadVideo();

        return () => {
        isMounted = false;
        };
    }, [src]);

    useEffect(() => {
        if (videoRef.current) {
        videoRef.current.volume = volume;
        }
    }, [volume]);

    const handlePlayPause = () => {
        if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
        setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
        videoRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
        }
    };

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const showControlsTemporarily = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        }, 3000);
    };

    if (isLoading) {
        return <Skeleton className={className} />;
    }

    return (
        <div 
        className={cn("relative group", className)}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onMouseMove={showControlsTemporarily}
        >
        <video
            ref={videoRef}
            src={videoSrc || src}
            className="w-full h-full object-cover"
            autoPlay={autoPlay}
            loop={loop}
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
        />

        {/* Loading Overlay */}
        {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        )}

        {/* Controls */}
        <div 
            className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
            )}
        >
            <div className="space-y-2">
            {/* Progress Bar */}
            <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={handleSeek}
                className="h-1"
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-white/80 transition-colors"
                >
                    {isPlaying ? (
                    <Pause className="w-6 h-6" />
                    ) : (
                    <Play className="w-6 h-6" />
                    )}
                </button>

                {/* Time Display */}
                <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                </div>

                {/* Volume Controls */}
                <div className="flex items-center gap-2">
                <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value: number[]) => setVolume(value[0] / 100)}
                    className="w-24 h-1"
                />
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-white/80 transition-colors"
                >
                    {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                    ) : (
                    <Volume2 className="w-6 h-6" />
                    )}
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }