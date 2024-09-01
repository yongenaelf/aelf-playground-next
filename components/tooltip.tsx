import {
  Tooltip as _Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Tooltip({
  children,
  text,
}: React.PropsWithChildren<{ text: string }>) {
  return (
    <TooltipProvider>
      <_Tooltip delayDuration={0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </_Tooltip>
    </TooltipProvider>
  );
}
