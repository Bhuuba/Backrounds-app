"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
}

export function VideoPlayer({ src, poster, currentTime = 0, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && currentTime >= 0) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <video
      ref={videoRef}
      className="aspect-video w-full rounded-lg border bg-black"
      controls
      poster={poster}
      onTimeUpdate={(event) => onTimeUpdate?.((event.target as HTMLVideoElement).currentTime)}
    >
      {src ? <source src={src} /> : <track kind="captions" />}
    </video>
  );
}
