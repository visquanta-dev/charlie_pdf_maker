"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { parseGPTOutput } from "@/lib/parser/paste-parser";
import type { AuditReportData } from "@/lib/types/audit";

interface PasteImportProps {
  onImport: (data: AuditReportData) => void;
}

export function PasteImport({ onImport }: PasteImportProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleParse() {
    try {
      const data = parseGPTOutput(text);
      onImport(data);
      setOpen(false);
      setText("");
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse input");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Paste GPT Output
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import from GPT Output</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste the raw GPT audit output below. The parser will extract what
            it can and pre-fill the form.
          </p>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={16}
            placeholder="Paste GPT output here..."
            className="font-mono text-xs"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleParse} disabled={!text.trim()}>
              Parse & Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
