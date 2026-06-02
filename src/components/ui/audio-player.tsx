"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number = 0) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "relative w-full h-1 bg-white/20 rounded-full cursor-pointer",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ width: `${value}%`, background: 'var(--color-mag-400)' }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

const AudioPlayer = ({
  src,
  cover,
  title,
  artist,
}: {
  src: string;
  cover?: string;
  title?: string;
  artist?: string;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const prog =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isFinite(prog) ? prog : 0);
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (value / 100) * audioRef.current.duration;
      if (isFinite(time)) {
        audioRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="relative flex flex-col mx-auto rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)] backdrop-blur-sm p-3 w-full"
        style={{ background: 'rgba(17,17,17,0.7)', border: '1px solid rgba(219,137,24,0.15)' }}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1, type: "spring" }}
        layout
      >
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          loop={isRepeat}
          src={src}
          className="hidden"
        />

        <motion.div className="flex flex-col relative" layout>
          {/* Cover */}
          {cover && (
            <motion.div className="overflow-hidden rounded-2xl h-[160px] w-full relative mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={title ?? "cover"}
                className="object-cover w-full h-full"
              />
            </motion.div>
          )}

          <div className="flex flex-col w-full gap-y-2 px-1">
            {/* Title + artist */}
            {title && (
              <div className="text-center">
                <p className="text-white font-bold text-sm leading-tight">{title}</p>
                {artist && <p className="text-white/40 text-xs mt-0.5">{artist}</p>}
              </div>
            )}

            {/* Slider + timestamps */}
            <div className="flex flex-col gap-y-1">
              <CustomSlider value={progress} onChange={handleSeek} />
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs">{formatTime(currentTime)}</span>
                <span className="text-white/50 text-xs">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center w-full pb-1">
              <div className="flex items-center gap-1 w-fit rounded-2xl p-1"
                style={{ background: 'rgba(17,17,17,0.6)' }}>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon"
                    onClick={() => setIsShuffle(v => !v)}
                    className={cn(
                      "text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full transition-colors",
                      isShuffle && "text-[#db8918]"
                    )}>
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon"
                    className="text-white hover:bg-white/10 h-8 w-8 rounded-full">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={togglePlay} variant="ghost" size="icon"
                    className="text-[#07070E] h-9 w-9 rounded-full"
                    style={{ background: 'var(--color-mag-400)' }}>
                    {isPlaying
                      ? <Pause className="h-4 w-4" />
                      : <Play className="h-4 w-4 ml-0.5" />}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon"
                    className="text-white hover:bg-white/10 h-8 w-8 rounded-full">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon"
                    onClick={() => setIsRepeat(v => !v)}
                    className={cn(
                      "text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full transition-colors",
                      isRepeat && "text-[#db8918]"
                    )}>
                    <Repeat className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioPlayer;
