"use client";
import { Copy, CopyCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToast } from "@/components/ui/use-toast";

export function ShareLink({ id }: { id: string }) {
  const { toast } = useToast();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    return `${origin}/share/${id}`;
  }, [id, origin]);

  return (
    <div className="flex">
      <Link to={url} className="mr-4">
        {url}
      </Link>
      <CopyToClipboard
        text={url}
        onCopy={() => {
          setCopied(true);

          toast({
            title: "Link Copied",
            description: "Share link has been copied to your clipboard.",
            
          });
        }}
      >
        {copied ? (
          <CopyCheck className="w-4 h-4 cursor-pointer" />
        ) : (
          <Copy className="w-4 h-4 cursor-pointer" />
        )}
      </CopyToClipboard>
    </div>
  );
}
