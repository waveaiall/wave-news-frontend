import { PlayButton } from "@/components/play-button";
import { cn } from "@/lib/utils";

interface AudioRecorderProps extends React.HTMLAttributes<HTMLDivElement> {
}

export default function AudioRecorder({ className, ...props }: AudioRecorderProps) {
  return (
    <div className={cn("grid place-content-center", className)}>
      <div className="bg-red-500">
        <PlayButton />
      </div>
    </div>
  )
}