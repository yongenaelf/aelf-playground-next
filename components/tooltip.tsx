import {
  Tooltip as _Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Tooltip({
  children,
  text,
  asChild = true,
}: React.PropsWithChildren<{ text: string; asChild?: boolean }>) {
  return (
    <TooltipProvider>
      <_Tooltip delayDuration={0}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </_Tooltip>
    </TooltipProvider>
  );
}
