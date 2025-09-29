import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function TimeTracker({ 
  onTimeUpdate,
  className,
  initialTime = 0 
}) {
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval = null;
    
    if (isTracking) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        setSeconds(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsTracking(true);
    setStartTime(new Date().getTime());
    setSeconds(0);
  };

  const handleStop = () => {
    setIsTracking(false);
    if (onTimeUpdate && seconds > 0) {
      const minutes = Math.round(seconds / 60 * 100) / 100;
      onTimeUpdate(minutes);
    }
    setSeconds(0);
    setStartTime(null);
  };

  const handlePause = () => {
    setIsTracking(false);
  };

  const handleResume = () => {
    setIsTracking(true);
    setStartTime(new Date().getTime() - (seconds * 1000));
  };

  return (
    <div className={cn("flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 shadow-sm", className)}>
      <div className="flex-1">
        <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
          {formatTime(seconds)}
        </div>
        <div className="text-sm text-slate-600">
          {isTracking ? "Tracking time..." : "Ready to track"}
        </div>
      </div>
      
      <div className="flex gap-2">
        {!isTracking && seconds === 0 && (
          <Button
            variant="success"
            size="sm"
            icon="Play"
            onClick={handleStart}
          >
            Start
          </Button>
        )}
        
        {isTracking && (
          <Button
            variant="secondary"
            size="sm"
            icon="Pause"
            onClick={handlePause}
          >
            Pause
          </Button>
        )}
        
        {!isTracking && seconds > 0 && (
          <>
            <Button
              variant="success"
              size="sm"
              icon="Play"
              onClick={handleResume}
            >
              Resume
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon="Square"
              onClick={handleStop}
            >
              Stop
            </Button>
          </>
        )}
        
        {isTracking && (
          <Button
            variant="danger"
            size="sm"
            icon="Square"
            onClick={handleStop}
          >
            Stop
          </Button>
        )}
      </div>
    </div>
  );
}