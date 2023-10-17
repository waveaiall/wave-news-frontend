import { cn } from "@/lib/utils";

interface ConversationProps extends React.HTMLAttributes<HTMLDivElement> {
}

export default function Conversation({ className, ...props }: ConversationProps) {
  return (
    <div className={cn("", className)}>
      <p>Conversation</p>
    </div>
  )
}