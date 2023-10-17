import AudioRecorder from "@/components/audio-recorder";
import Conversation from "@/components/conversation";

export default function News() {
  return (
    <div className="h-screen grid grid-rows-4 gap-4">
      <Conversation className="bg-slate-300	row-span-3" />
      <AudioRecorder className="bg-neutral-400 row-span-1" />
    </div>
  )
}