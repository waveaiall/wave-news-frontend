'use client'

import { Mic, StopCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAudioRecorder } from "react-audio-voice-recorder";
import { useEffect } from "react";

const record = async () => {
  if (navigator.mediaDevices) {
    console.log("getUserMedia supported.");
  } else {
    console.log("recording not supported");
  }
}

export function PlayButton() {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
  );

  useEffect(() => {
    if (!recordingBlob) return;
    console.log("recordingBlob is ready")
    console.log(`crossOriginIsolated: ${crossOriginIsolated}`)
    const url = URL.createObjectURL(recordingBlob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `audio.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recordingBlob])

  return (
    <Button variant="outline" size="icon" onClick={isRecording ? () => stopRecording() : startRecording}>
      {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}
