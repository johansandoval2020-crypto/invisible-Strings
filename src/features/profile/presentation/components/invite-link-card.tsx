"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function InviteLinkCard({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = React.useState(false);
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${inviteCode}`
      : `/invite/${inviteCode}`;

  async function copy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Enlace copiado");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <Input readOnly value={inviteUrl} className="font-mono text-xs" />
      <Button type="button" variant="outline" size="icon" onClick={copy}>
        {copied ? <Check className="text-lavender-accent" /> : <Copy />}
      </Button>
    </div>
  );
}
